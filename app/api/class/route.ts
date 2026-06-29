import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
    try {
        const classes = await prisma.class.findMany({
            include: {
                _count: {
                    select: { members: true }
                }
            },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json({ success: true, classes }, { status: 200 });
    } catch (error) {
        console.error("Error fetching classes:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        if (!data.name) {
            return NextResponse.json({ success: false, message: "Class name is required" }, { status: 400 });
        }

        const newClass = await prisma.class.create({
            data: {
                name: data.name,
                description: data.description || null,
            }
        });

        revalidatePath('/admin/classes', 'layout');
        revalidatePath('/directory', 'layout');

        return NextResponse.json({ success: true, message: "Class created successfully", class: newClass }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating class:", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ success: false, message: "Class with this name already exists" }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
