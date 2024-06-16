import { NewUser, insertUser, getUsers, db, getUserbyEmail, getMyTeam } from "@/drizzle/db";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest){
    try {
        const data = await request.json();
        const { email, password, rememberMe } = data;
        // console.log( email, password, rememberMe);
        if (!email || !password) {
          return NextResponse.json({ error: 'Complete All the fields please!' }, { status: 400 });
        }

        const checkUser = await getUserbyEmail(email);
        if(checkUser.length == 0){
            // handle user exists!
            return NextResponse.json({ message: "User Does not Exist" }, { status : 404 })
        }
        
        const userFetched = checkUser[0];
        const userTeamPromise = getMyTeam(userFetched.id); 

        const validatePass = await bcryptjs.compare(password, userFetched.password);
        if(!validatePass){
            return NextResponse.json({ message: 'Incorrect Email or Pass.' }, { status: 403 });
        }

        // if(!userFetched.verified){
        //   return NextResponse.json({ message: 'Unverified' }, { status: 402 });
        // }

        const userTeam = await userTeamPromise;
        const expiryTime = rememberMe ? '10d' : '10h'; 

        // token
        const tokenData = {
            id: userFetched.id,
            email: userFetched.email,
            verified: userFetched.verified,
            teamAdminOf: userTeam,
            expiryTime: expiryTime
        }

        const redirectURL = userTeam.length == 0 ? "/details" : "/";

        console.log(tokenData)
        const token = jwt.sign(tokenData, process.env.JWT_TOKEN_SECRET!, { expiresIn: expiryTime });
        
        const response = NextResponse.json({message: 'success logging in.', redirectURL: redirectURL }, { status: 201 })

        response.cookies.set("token", token, {
            httpOnly: true
        })

        return response

      } catch (error: any) {
        // Log the error for debugging purposes
        console.error('Error in POST /api/login:', error);
    
        // Determine the type of error and respond accordingly
        if (error instanceof SyntaxError) {
          return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
        } else if (error.name === 'ValidationError') {
          return NextResponse.json({ error: error.message }, { status: 400 });
        } else if (error.name === 'DatabaseError') {
          return NextResponse.json({ error: 'Database error occurred' }, { status: 500 });
        } else {
          return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
      }
    
}