import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const members = await prisma.member.findMany({
            include: {
                businesses: true,
                class: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json(members);
    } catch (error) {
        console.error("Error fetching all members:", error);
        return NextResponse.json({ message: "Error fetching members" }, { status: 500 });
    }
}
