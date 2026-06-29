import { prisma } from "@/lib/prisma";
import ClassDetailsClient from "./ClassDetailsClient";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ClassDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const classData = await prisma.class.findUnique({
        where: { classId: id },
        include: {
            members: {
                include: {
                    member: true
                }
            }
        }
    });

    if (!classData) {
        return notFound();
    }

    // Flatten member structure for easier mapping in client
    const flattenedClassData = {
        ...classData,
        members: classData.members.map(m => m.member)
    };

    const allMembers = await prisma.member.findMany({
        orderBy: { name: 'asc' }
    });

    return <ClassDetailsClient classData={flattenedClassData} allMembers={allMembers} classId={id} />;
}
