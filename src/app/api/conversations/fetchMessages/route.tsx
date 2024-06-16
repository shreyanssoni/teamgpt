import { createNewConversation, fetchMessages } from "@/drizzle/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const { convId } = await request.json();
    try { 
        const messagesFetched = await fetchMessages(convId); 
        // console.log("message", messagesFetched); 
        return NextResponse.json({content: messagesFetched}, {status: 200})
    } catch (error) {
        console.error(error); 
        return NextResponse.json({ content: "none"}, {status: 500}); 
    }
}