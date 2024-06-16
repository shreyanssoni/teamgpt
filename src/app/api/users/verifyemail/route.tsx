import { getUserbyToken, userverified } from "@/drizzle/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { getTokenData } from "@/helpers/getTokenData";

export async function POST(request: NextRequest){
    try {
        const data = await request.json();
        const {token} = await data;  

        const user = await getUserbyToken(token); 

        console.log(user); 
        if(!user || user.length == 0){
            return NextResponse.json({ error: "user not found" }, {status: 400}); 
        }

        const tokenD = getTokenData(request); 
        const verified = await userverified(tokenD.email); 

        const tokenData = {
            id: tokenD.id,
            email: tokenD.email,
            verified: true,
            teamAdminOf: tokenD.teamAdminOf,
            expiryTime: tokenD.expiryTime
        }

        const tokenNew = jwt.sign(tokenData, process.env.JWT_TOKEN_SECRET!, { expiresIn: tokenData.expiryTime });
        const response = NextResponse.json({
            message: "User successfull verified!",
        }, { status: 200 }); 

        response.cookies.set("token", tokenNew, {
            httpOnly: true
        })
        
        return response 

    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}