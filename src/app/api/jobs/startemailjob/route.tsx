import { Client } from "@upstash/qstash";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try{
    const qstashClient = new Client({ token: process.env.QSTASH_TOKEN!});
    const body = await request.json();
    const email = body.email; 
    const emailtype = body.emailtype; 
    const content = body.content; 
    const rootDomain = request.url.split('/').slice(0, 3).join('/');
    // console.log(rootDomain); 
    const emailAPIURL = `${process.env.NEXT_DOMAIN}/api/jobs/sendemail`; 
    
    const sendBody = {
      email: email,
      emailtype: emailtype,
      content: content
    }
    // console.log(sendBody)
  
    // Tell QStash to start the background job.
    // For proper error handling, refer to the quick start.
    await qstashClient.publishJSON({
      url: emailAPIURL,
      body: sendBody
    });
  
    return NextResponse.json({message: "Job started"}, { status: 200 });
  } catch (error:any) {
    console.error(error);
    return NextResponse.json({error: error.message}, { status: 200 });
  }
  
}

