import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const classData = await prisma.class.findUnique({
            where: { classId: id },
            include: {
                members: {
                    include: {
                        businesses: true
                    },
                    orderBy: { name: 'asc' }
                }
            }
        });

        if (!classData) {
            return NextResponse.json({ success: false, message: "Class not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, class: classData }, { status: 200 });
    } catch (error) {
        console.error("Error fetching class:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await request.json();

        // If data contains memberId and action, we are assigning/removing a single member
        if (data.action && data.memberId) {
            if (data.action === 'assign') {
                await prisma.member.update({
                    where: { memberId: data.memberId },
                    data: { classId: id }
                });
            } else if (data.action === 'remove') {
                await prisma.member.update({
                    where: { memberId: data.memberId },
                    data: { classId: null }
                });
            }
            revalidatePath('/admin/classes', 'layout');
            revalidatePath('/directory', 'layout');
            return NextResponse.json({ success: true, message: `Member ${data.action}ed successfully` }, { status: 200 });
        }

        // Otherwise updating class details
        const updatedClass = await prisma.class.update({
            where: { classId: id },
            data: {
                name: data.name,
                description: data.description,
            }
        });

        revalidatePath('/admin/classes', 'layout');
        revalidatePath('/directory', 'layout');

        return NextResponse.json({ success: true, message: "Class updated successfully", class: updatedClass }, { status: 200 });
    } catch (error: any) {
        console.error("Error updating class:", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ success: false, message: "Class with this name already exists" }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.class.delete({
            where: { classId: id }
        });

        revalidatePath('/admin/classes', 'layout');
        revalidatePath('/directory', 'layout');

        return NextResponse.json({ success: true, message: "Class deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting class:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
