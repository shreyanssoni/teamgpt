import { addNewTeam, getMyTeam } from "@/drizzle/db";
import { getTokenData } from "@/helpers/getTokenData";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest){
    try {
        const data = await request.json(); 
        const tokenData = getTokenData(request);
    
        const checkTeam = await getMyTeam(tokenData.id);

        if(checkTeam.length > 0){ 
            // console.log("iaminside")
            return NextResponse.json({success: false, message: "Team for this user already exists."}, {status: 403})
        }
        
        const payload = {
            name: data.name,
            admin: tokenData.id
        }

        const createTeam = await addNewTeam(payload);
        // console.log(createTeam[0])

        const newtokenData = {
            id: tokenData.id,
            email: tokenData.email,
            verified: tokenData.verified,
            teamAdminOf: createTeam,
            expiryTime: tokenData.expiryTime
        }

        const token = jwt.sign(tokenData, process.env.JWT_TOKEN_SECRET!);
        
        const response = NextResponse.json({success: true, message: "success creating team"}, {status: 200});

        response.cookies.set("token", token, {
            httpOnly: true
        })

        return response

    } catch(error: any) {
        console.error("error creating team", error);
        return NextResponse.json({success: false, message: "error creating team"}, {status: 500});
    } 

}