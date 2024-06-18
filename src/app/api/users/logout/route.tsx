import { NextResponse } from 'next/server';
import { permanentRedirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function GET(){
  try {
    const cookieStore = cookies(); 
    const myCookie = cookieStore.get("token");
    // console.log("my cookies", myCookie);
    cookies().set("token", ""); 
    const response = NextResponse.json({
        message: "Logout Successful"
    }, {status: 200})
    
    response.cookies.set("token",'' , {
        httpOnly: true, expires: new Date(0)
    });
    
    return response 
    
  } catch (error: any){
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
