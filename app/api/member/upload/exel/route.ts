import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file = data.get('file') as File;
        if (!file) {
            return NextResponse.json({
                success: false,
                message: "File not found",
            }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as any[];

        // Generate a unique batch ID for this upload
        const now = new Date();
        const batchId = `Upload ${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;


        for (const row of rows) {
            const name = row['Name'];
            const phone = row['Phone Number']?.toString();
            const email = row['Mail Id'];
            
            if (!name || !phone || !email) continue;

            const websiteRaw = row['Website'];
            let website = null;
            if (websiteRaw && typeof websiteRaw === 'string') {
                const cleanWeb = websiteRaw.trim();
                if (!['NIL', 'Nil', 'nil', '.', '-', 'NA', 'na'].includes(cleanWeb)) {
                    website = cleanWeb;
                }
            }

            const instaRaw = row['Instagram Link'];
            let instagramUrl = null;
            if (instaRaw && typeof instaRaw === 'string') {
                const cleanInsta = instaRaw.trim();
                if (!['NIL', 'Nil', 'nil', '.', '-', 'NA', 'na'].includes(cleanInsta)) {
                    instagramUrl = cleanInsta;
                }
            }

            let clientsList: string[] = [];
            if (row['Top 5 Clients']) {
                const clientsListRaw = row['Top 5 Clients'];
                if (clientsListRaw && typeof clientsListRaw === 'string' && !['NIL', 'Nill', 'NA', 'na', '-', '.'].includes(clientsListRaw.trim())) {
                    // Remove "NIL" noise
                    const cleanRaw = clientsListRaw.replace(/NIL/gi, '');
                    // Split by comma, newline, or numbered lists like "1)", "2.", etc.
                    clientsList = cleanRaw.split(/(?:,|\n|\d+\)|\d+\.)/).map(c => c.trim()).filter(c => c.length > 0 && c !== '.');
                }
            }

            // Upsert Member
            const existingMember = await prisma.member.findFirst({
                where: {
                    OR: [
                        { email },
                        { phone }
                    ]
                }
            });

            let memberId = existingMember?.memberId;

            if (!memberId) {
                const newMember = await prisma.member.create({
                    data: {
                        name,
                        phone,
                        email,
                        address: row['Address'] || '',
                        profileImageUrl: row['Photo'] || '',
                        usp: row['USP'] || '',
                        whatWeDo: row['What we Do'] || '',
                        instagramUrl,
                        uploadBatch: batchId,
                    }
                });
                memberId = newMember.memberId;
            } else {
                await prisma.member.update({
                    where: { memberId },
                    data: {
                        name,
                        phone,
                        email,
                        address: row['Address'] || '',
                        profileImageUrl: row['Photo'] || '',
                        usp: row['USP'] || '',
                        whatWeDo: row['What we Do'] || '',
                        instagramUrl,
                        uploadBatch: batchId,
                    }
                });
            }

            // Handle business
            const businessName = row['Company Name'];
            if (businessName) {
                const existingBusiness = await prisma.bussines.findFirst({
                    where: {
                        ownerId: memberId,
                        bussinessName: businessName
                    }
                });

                if (!existingBusiness) {
                    await prisma.bussines.create({
                        data: {
                            bussinessName: businessName,
                            bussinessLogo: row['Company Logo'] || '',
                            website,
                            category: row['Category'] || '',
                            ownerId: memberId
                        }
                    });
                } else {
                    await prisma.bussines.update({
                        where: { bussinessId: existingBusiness.bussinessId },
                        data: {
                            bussinessLogo: row['Company Logo'] || '',
                            website,
                            category: row['Category'] || '',
                        }
                    });
                }
            }

            // Handle clients
            if (clientsList.length > 0) {
                const existingClients = await prisma.client.findMany({
                    where: { memberId }
                });
                const existingClientNames = existingClients.map(c => c.clientBussinessName);

                for (const clientName of clientsList) {
                    if (!existingClientNames.includes(clientName)) {
                        await prisma.client.create({
                            data: {
                                clientBussinessName: clientName,
                                memberId: memberId
                            }
                        });
                    }
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: "Data uploaded successfully"
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Internal server error",
        }, { status: 500 });
    }
}