import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const member = await prisma.member.findUnique({
            where: { memberId: id },
            include: {
                businesses: true,
                clients: true
            }
        });

        if (!member) {
            return NextResponse.json({ message: "Member not found" }, { status: 404 });
        }

        return NextResponse.json(member);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error fetching member" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        // Prisma transaction to ensure everything is deleted cleanly
        await prisma.$transaction([
            prisma.client.deleteMany({ where: { memberId: id } }),
            prisma.bussiness.deleteMany({ where: { memberId: id } }),
            prisma.member.delete({ where: { memberId: id } })
        ]);

        return NextResponse.json({ message: "Member deleted successfully" });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ message: "Error deleting member" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        // Separate nested relations from the main member data
        const { bussinesses, clients, ...memberData } = body;

        // We will do a transaction to update member, and wipe & recreate relations
        // (A simple approach to handling updates of relations without complex diffing)
        await prisma.$transaction(async (tx: any) => {
            // Update main member fields
            await tx.member.update({
                where: { memberId: id },
                data: {
                    name: memberData.name,
                    email: memberData.email,
                    phone: memberData.phone,
                    address: memberData.address,
                    postName: memberData.postName,
                    usp: memberData.usp,
                    whatWeDo: memberData.whatWeDo,
                    instagramUrl: memberData.instagramUrl,
                    profileImageUrl: memberData.profileImageUrl,
                }
            });

            // Wipe existing
            await tx.bussiness.deleteMany({ where: { memberId: id } });
            await tx.client.deleteMany({ where: { memberId: id } });

            // Recreate businesses
            if (bussinesses && bussinesses.length > 0) {
                await tx.bussiness.createMany({
                    data: bussinesses.map((b: any) => ({
                        memberId: id,
                        bussinessName: b.bussinessName || "",
                        bussinessLogo: b.bussinessLogo || null,
                        website: b.website || null,
                        category: b.category || "",
                        businessType: b.businessType || ""
                    }))
                });
            }

            // Recreate clients
            if (clients && clients.length > 0) {
                await tx.client.createMany({
                    data: clients.map((c: any) => ({
                        memberId: id,
                        clientBussinessName: c.clientBussinessName || "",
                        clientBussinessLogo: c.clientBussinessLogo || null,
                        clientBussinessCategory: c.clientBussinessCategory || "",
                        clientBussinessLink: c.clientBussinessLink || null,
                        aboutClientBussiness: c.aboutClientBussiness || ""
                    }))
                });
            }
        });

        return NextResponse.json({ message: "Member updated successfully" });

    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({ message: "Error updating member" }, { status: 500 });
    }
}
