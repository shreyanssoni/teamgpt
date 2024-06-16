import { NextRequest, NextResponse } from "next/server";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(request: NextRequest){
    const { userMessage } = await request.json();
    try { 
        const response = await run(userMessage)
        return NextResponse.json({content: response}, {status: 200})
    } catch (error) {
        console.error(error); 
        return NextResponse.json({ content: "none"}, {status: 500}); 
    }
}

async function run(userMessage: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  const result = await model.generateContent(
    "Respond to the user message in less than 50 words: " + userMessage
  );
  return result.response.text(); 
}
