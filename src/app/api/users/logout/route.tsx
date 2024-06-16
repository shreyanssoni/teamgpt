import { NextResponse } from 'next/server';
import { permanentRedirect } from 'next/navigation';

export async function GET(){
  try {
    const response = NextResponse.json({
        message: "Logout Successful"
    }, {status: 200})
    
    response.cookies.set("token", "", {
        httpOnly: true, expires: new Date(0)
    });
    
    return response 
    
  } catch (error: any){
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
