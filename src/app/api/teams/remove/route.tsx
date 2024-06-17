import { userRemoveFromTeam } from "@/drizzle/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try {
        const { userid, teamId } = await request.json(); 
        const res = await userRemoveFromTeam(userid, teamId);
        // console.log(userid); 
        return NextResponse.json({ content: "user removed" }, {status: 200});
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, {status: 400});
    }
}