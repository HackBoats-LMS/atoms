import { prisma } from "@/lib/prisma";
import {NextRequest,NextResponse} from "next/server";

export async function POST(request:NextRequest){
    try {
        const data  = await request.json();

        const member = await prisma.member.create({
            data:{
                name:data.name,
                email:data.email,
                phone:data.phone,
                address:data.address,
                postName:data.postName,
                usp:data.usp,
                whatWeDo:data.whatWeDo,
                instagramUrl:data.instagramUrl,
                profileImageUrl:data.profileImageUrl,
                
                businesses:{
                    create: data.businesses,
                },

                clients:{
                    create:data.clients
                }
            },
            include:{
                businesses: true,
                clients: true,
            }
        })

        return NextResponse.json({
            success:true,
            message:"Member created successfully",
            member
        },{status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message:"Internal server error",
            success:false
        },{status:500})
    }
}