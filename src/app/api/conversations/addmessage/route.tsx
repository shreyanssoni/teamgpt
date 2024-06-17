import { createNewConversation, createNewMessage, fetchMessages } from "@/drizzle/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const { newMsg, convoId } = await request.json();
    try { 
        console.log(newMsg, convoId); 
        const addedMessage = await createNewMessage(newMsg, convoId); 
        console.log("message", newMsg, convoId); 
        return NextResponse.json({content: addedMessage}, {status: 200})
    } catch (error) {
        console.error(error); 
        return NextResponse.json({ content: "none"}, {status: 500}); 
    }
}