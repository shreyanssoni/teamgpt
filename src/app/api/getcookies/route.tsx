import { getTokenData } from "@/helpers/getTokenData";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const {pass} = await request.json(); 
    try {
        if(pass == 'COOKIES'){ 
            const tokenData = getTokenData(request); 
            return NextResponse.json({content: tokenData}, {status: 200});
        }
    } catch (error) {   
        console.error(error); 
        return NextResponse.json({content: "error retrieving token"}, {status: 400}); 
    }
    
}