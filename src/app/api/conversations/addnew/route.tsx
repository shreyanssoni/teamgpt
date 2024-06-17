import { createNewConversation } from "@/drizzle/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const { slug, teamId } = await request.json();
    try { 
        const newConvo = await createNewConversation(slug, teamId); 
    
        return NextResponse.json({message: "success", content: newConvo}, {status: 200})
    } catch (error:any) {
        console.error(error); 
        if(error.message == 'Rollback'){
            // console.log('rollback');
            return NextResponse.json({ message: "team credits are zero!"}, {status: 422}); 
        }
        return NextResponse.json({ message: "new convo not created", content: "none"}, {status: 500}); 
    }
}