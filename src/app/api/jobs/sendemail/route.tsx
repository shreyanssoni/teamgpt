import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs'; 
import axios from 'axios';
import { updateUsertoken } from '@/drizzle/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest){
    const { email, emailType } :any = await request.json(); 
    try {
        const hashedToken = await bcryptjs.hash(email.toString(), 10);
        if(emailType == 'VERIFY'){
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            await updateUsertoken(hashedToken, email, expiryDate); 
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS
            }
        })

        const mailOptions = {
            from: "sonishreyans01@gmail.com",
            to: email,
            subject: emailType == 'VERIFY' ? "Verify your account" : 
            "Your team credits have reached 0",
            html:`<p>Click here: <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}"></a> to verify you email!</p>`
        }
        const mailresponse = await transport.sendMail(mailOptions); 

        return NextResponse.json({ message: 'sent the mail' }, {status : 200})

    } catch (error:any) {
        console.log(error.message); 
        return NextResponse.json({ error: error.message }, {status : 500})

    }
}