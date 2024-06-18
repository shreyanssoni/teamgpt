import { addMembertoTeam, checkMemberShip, getCredits } from "@/drizzle/db";
import { getTokenData } from "@/helpers/getTokenData";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const { teamId } = await request.json();
    try {
        const newCreds = await getCredits(teamId); 
        console.log(newCreds)
        return NextResponse.json({ content: newCreds, success: true })
    } catch (error:any) {
        console.log(error.message);
        return NextResponse.json({ error: error.message }, {status: 400})
    }
    
}