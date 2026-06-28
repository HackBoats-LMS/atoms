import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.admin.delete({
            where: { id: id }
        });
        return NextResponse.json({ message: "Admin deleted successfully" });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ message: "Error deleting admin" }, { status: 500 });
    }
}
