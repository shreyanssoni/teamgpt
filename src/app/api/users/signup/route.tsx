import { NewUser, insertUser, getUsers, db, getUserbyEmail } from "@/drizzle/db";
import { NextRequest, NextResponse } from "next/server";
var bcryptjs = require('bcryptjs');

export async function POST(request: NextRequest){
    try {
        const data = await request.json();
        const { name, email, password } = data;
        // console.log(name, email, password);
        if (!name || !email || !password) {
          return NextResponse.json({ error: 'Complete All the fields please!' }, { status: 400 });
        }

        const check = await getUserbyEmail(email);
        if(check.length > 0){
            // handle user exists!
            return NextResponse.json({ message: "User Exists" }, { status : 409 })
        }

        // hash password 
        const salt = await bcryptjs.genSalt(10);
        const hashedPass = await bcryptjs.hash(password, salt);
    
        const userDetails: NewUser = {
          email: email,
          name: name,
          password: hashedPass, 
          verfied: false
        };
    
        const res = await insertUser(userDetails);
        console.log(res)
        return NextResponse.json({ message: 'success creating user.' }, { status: 201 });
      } catch (error: any) {
        // Log the error for debugging purposes
        console.error('Error in POST /api/signup:', error);
    
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