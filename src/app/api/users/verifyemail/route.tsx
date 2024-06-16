import { getUserbyToken } from "@/drizzle/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try {
        const data = await request.json();
        const {token} = data; 
        console.log(token)
        const user = await getUserbyToken(token); 

        console.log(user); 
        if(!user){
            return NextResponse.json({ error: "user not found" }, {status: 400}); 
        }

        return NextResponse.json({
            message: "User successfull verified!",
        }, { status: 200 }); 

    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}