import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { getUserbyEmail } from "@/drizzle/db";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email" },
                password: { label: "Password", type: "password"}
            },
            async authorize(credentials: any): Promise<any>{
                try {
                    const user:any = await getUserbyEmail(credentials.identifier);
                    if(!user){
                        throw new Error("User doesnot exist.");
                    }

                    if(!user.verified){
                        throw new Error("User not verified.");
                    }

                    const passCheck = await bcryptjs.compare(user.password, credentials.password); 
                    if(passCheck){
                        return user;
                    } else {
                        throw new Error("Password incorrect.");
                    }

                } catch (error: any) {
                    throw new Error(error);
                }
            }
        })
    ],
    callbacks : {
        async jwt({ token, user }){
            if (user){
                token.id = user.id
                token.verified = user.verified
            }
            return token
        },
        async session({ session, token }){
            return session
        }
    },
    pages: {

    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXT_AUTH_SECRET
}