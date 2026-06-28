import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import {prisma} from "@/lib/prisma"


export const authOptions:NextAuthOptions = {
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
    ],

    callbacks:{
        async signIn({user}){
            if(!user?.email){
                return false
            }
            const exists = await prisma.admin.findUnique({
                where:{
                    email: user.email
                }
            })

            if(exists){
                return true
            }

            return false;


        }
    },
    secret: process.env.NEXTAUTH_SECRET
}

export default authOptions
