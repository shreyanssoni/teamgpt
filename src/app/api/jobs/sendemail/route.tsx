import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs'; 
import axios from 'axios';
import { updateUsertoken } from '@/drizzle/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest){
    const { email, emailtype, content } :any = await request.json(); 
    console.log("trying to mail" , email, emailtype, content);
    try {
        const hashedToken = await bcryptjs.hash(email, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        await updateUsertoken(hashedToken, email, expiryDate); 

        var transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: process.env.NEXT_EMAIL,
              pass: process.env.NEXT_PASS
            }
          });

        const mailOptions = {
            from: process.env.NEXT_EMAIL,
            to: email,
            subject: emailtype == 'INVITE' ? "Invite for team: TEAM GPT" : (emailtype == 'CREDITS' ? `Your Credits for team ${content} are Low: TEAM GPT` : "Verify your account: TEAM GPT"),
            html: emailtype == 'INVITE' ? `<p>You are invited to join ${content.split("&")[0].split("=")[1]}</p><p>Click here: <a href="${process.env.NEXT_DOMAIN}/jointeam?${content}">INVITE LINK</a> to join the team.!</p>` : (emailtype == 'CREDITS' ? `<p>Your Credits for team are low!<p><p>Please await 12:00 for renewal</p>` : `<p>Click here: <a href="${process.env.NEXT_DOMAIN}/verifyemail?token=${hashedToken}">VERIFY LINK</a> to verify you email!</p>`)
        }
        const mailresponse = await transport.sendMail(mailOptions); 
        // console.log(mailresponse);
        return NextResponse.json({ message: 'sent the mail' }, {status : 200})

    } catch (error:any) {
        console.log(error.message); 
        return NextResponse.json({ error: error.message }, {status : 500})

    }
}