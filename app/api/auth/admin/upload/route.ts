import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server"
export async function POST(request: NextRequest) {
    try {
        const { name, email } =await request.json()
        if(!email || !name){
            return NextResponse.json("email and name both are required");
        }

        const existingUser = await prisma.admin.findUnique({
            where:{
                email:email
            }
        })

        if(existingUser){
            return NextResponse.json({error:"user already exists"})
        }

        const newUser = await prisma.admin.create({
            data:{
                email:email,
                name:name
            }
        })
        return NextResponse.json(`user ${newUser.name} has been created successfully`)
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:"something went wrong"}, {status:500})
    }
}