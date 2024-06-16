import { addMembertoTeam, checkMemberShip } from "@/drizzle/db";
import { getTokenData } from "@/helpers/getTokenData";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const { teamName, teamId } = await request.json();
    const tokenData = getTokenData(request); 

    const exists = await checkMemberShip(tokenData.id, teamId)
    if(exists.length > 0){
        return NextResponse.json({ success: true, message: "user already in team!" }, { status: 402 })
    }
    const added = await addMembertoTeam(tokenData.id, teamId); 
    console.log(added); 

    return NextResponse.json({ success: true })
}