import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const businesses = await prisma.bussines.findMany({ select: { category: true } });
    const categories = [...new Set(businesses.map((b: any) => b.category).filter(Boolean))];
    console.log("UNIQUE_CATEGORIES:", JSON.stringify(categories));
}
main().catch(console.error).finally(() => prisma.$disconnect());
