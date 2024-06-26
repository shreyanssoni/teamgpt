import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getTokenData = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?. value || '';
        const decodedToken:any = jwt.verify(token, process.env.JWT_TOKEN_SECRET!);
        return decodedToken
    } catch (error: any){
        console.error("error in fetching token data", error)
    }
}