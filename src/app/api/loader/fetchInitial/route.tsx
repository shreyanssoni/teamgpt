import { getTeamConversations, getTeamsForUser, getUserbyEmail } from "@/drizzle/db";
import { getTokenData } from "@/helpers/getTokenData";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const tokenData = getTokenData(request); 

    try{ 
        const fetchDataPromise = getUserbyEmail(tokenData.email); 
        const fetchTeamsPromise  = getTeamsForUser(tokenData.id);
        const fetchMainTeamConvosPromise = getTeamConversations(tokenData.teamAdminOf[0].id);
    
        const [ fetchedData, fetchedTeams, fetchMainTeamConvos ] = await Promise.all([
            fetchDataPromise, 
            fetchTeamsPromise,
            fetchMainTeamConvosPromise
        ])

        return NextResponse.json({data: [fetchedData, fetchedTeams, fetchMainTeamConvos]}, {status: 200})

    } catch (error) {
        console.error("error in fetching initial", error);
        return NextResponse.json({message: `error in fetching ${error}`}, {status: 500})
    }
    


}