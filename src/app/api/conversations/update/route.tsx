import { updateDate } from "@/drizzle/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const {convoId} = await request.json(); 
    
    try {
        const date = await updateDate(convoId); 
        return NextResponse.json({ content: date }, {status: 200}); 

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, {status: 400});
    }

}