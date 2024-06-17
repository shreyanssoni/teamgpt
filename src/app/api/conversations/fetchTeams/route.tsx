import { NextRequest, NextResponse } from "next/server";
import { getTeamsForUser } from "@/drizzle/db";

export async function POST(request: NextRequest){
    try {
        const { userid } = await request.json(); 
        const teams = await getTeamsForUser(userid);
        console.log("teams", teams, userid); 
        return NextResponse.json({ content: teams }, {status: 200});
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, {status: 400});
    }
}