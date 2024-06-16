import { createNewConversation, fetchMessages, getTeamConversations } from "@/drizzle/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const { teamId } = await request.json();
    try { 
        const convosFetched = await getTeamConversations(teamId); 
        // console.log("message", messagesFetched); 
        return NextResponse.json({content: convosFetched}, {status: 200})
    } catch (error) {
        console.error(error); 
        return NextResponse.json({ content: "none"}, {status: 500}); 
    }
}