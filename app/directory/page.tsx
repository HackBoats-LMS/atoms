import { prisma } from "@/lib/prisma";
import DirectoryClient from "./DirectoryClient";

export default async function DirectoryPage() {
  const members = await prisma.member.findMany({
    include: {
      businesses: true,
      clients: true,
    }
  });

  return (
    <div className="min-h-screen bg-[#e5e5e5] p-4 md:p-8 lg:p-12 flex flex-col items-center font-sans">
      <DirectoryClient members={members} />
    </div>
  );
}
