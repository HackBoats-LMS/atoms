import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET all batches
export async function GET() {
    try {
        const batches = await prisma.member.groupBy({
            by: ['uploadBatch'],
            _count: {
                _all: true
            },
            orderBy: {
                uploadBatch: 'desc'
            }
        });

        // Filter out null batches
        const validBatches = batches.filter(b => b.uploadBatch !== null);

        return NextResponse.json(validBatches);
    } catch (error) {
        console.error("Fetch batches error:", error);
        return NextResponse.json({ message: "Error fetching batches" }, { status: 500 });
    }
}

// DELETE a specific batch
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const batchId = searchParams.get('batchId');

        if (!batchId) {
            return NextResponse.json({ message: "Batch ID is required" }, { status: 400 });
        }

        // We need to delete associated clients and businesses first because of foreign keys (unless cascade delete is set)
        // Prisma transactions are best for this. Wait, we can just delete the members and if Cascade is set, it deletes related.
        // Let's manually delete relations to be safe since we don't know if Cascade is configured.
        
        const membersInBatch = await prisma.member.findMany({
            where: { uploadBatch: batchId },
            select: { memberId: true }
        });

        const memberIds = membersInBatch.map(m => m.memberId);

        if (memberIds.length === 0) {
            return NextResponse.json({ message: "No members found for this batch" }, { status: 404 });
        }

        await prisma.$transaction([
            prisma.client.deleteMany({
                where: { memberId: { in: memberIds } }
            }),
            prisma.bussines.deleteMany({ // Note: schema says 'bussines' (typo in original schema model Bussines)
                where: { ownerId: { in: memberIds } }
            }),
            prisma.member.deleteMany({
                where: { uploadBatch: batchId }
            })
        ]);

        revalidatePath('/directory', 'layout');
        revalidatePath('/admin/members', 'layout');

        return NextResponse.json({ message: "Batch deleted successfully", count: memberIds.length });
    } catch (error) {
        console.error("Delete batch error:", error);
        return NextResponse.json({ message: "Error deleting batch" }, { status: 500 });
    }
}
