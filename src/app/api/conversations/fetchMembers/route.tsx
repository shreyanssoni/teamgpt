import { NextRequest, NextResponse } from "next/server";
import { fetchMembers, getTeamsForUser } from "@/drizzle/db";

export async function POST(request: NextRequest){
    try {
        const { teamId } = await request.json(); 
        const members = await fetchMembers(teamId);
        // console.log("members", members, teamId); 
        return NextResponse.json({ content: members }, {status: 200});
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, {status: 400});
    }
}