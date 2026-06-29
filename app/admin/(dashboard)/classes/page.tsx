import { prisma } from "@/lib/prisma";
import ClassesClient from "./ClassesClient";

export const dynamic = 'force-dynamic';

export default async function ClassesPage() {
    const classes = await prisma.class.findMany({
        include: {
            _count: {
                select: { members: true }
            }
        },
        orderBy: { name: 'asc' }
    });

    return <ClassesClient classes={classes} />;
}
