import { createNewConversation } from "@/drizzle/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const { slug, teamid } = await request.json();
    try { 
        const newConvo = await createNewConversation(slug, teamid); 
        // console.error("trying to debud" , newConvo); 
        return NextResponse.json({content: newConvo}, {status: 200})
    } catch (error:any) {
        if(error.message){
            return NextResponse.json({ message: "team credits are zero!"}, {status: 405}); 
        }
        return NextResponse.json({ message: "new convo not created", content: "none"}, {status: 500}); 
    }
}