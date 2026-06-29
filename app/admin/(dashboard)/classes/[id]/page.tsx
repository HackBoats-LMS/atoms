import { prisma } from "@/lib/prisma";
import ClassDetailsClient from "./ClassDetailsClient";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ClassDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const classData = await prisma.class.findUnique({
        where: { classId: id },
        include: {
            members: true
        }
    });

    if (!classData) {
        return notFound();
    }

    const allMembers = await prisma.member.findMany({
        orderBy: { name: 'asc' }
    });

    return <ClassDetailsClient classData={classData} allMembers={allMembers} classId={id} />;
}
