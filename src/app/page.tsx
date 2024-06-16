import { getTokenData } from "@/helpers/getTokenData";
import ChatTemplate from "./components/ChatTemplate";
import Unverified from "./components/Unverified";
import NotTeamFound from "./components/NoTeamFound";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getTeamsForUser, getUserbyEmail, getTeamConversations } from "@/drizzle/db";
import axios from "axios";

export default async function Home() {

  const token = cookies().get('token')?.value || '';
  const decodedToken:any = jwt.verify(token, process.env.JWT_TOKEN_SECRET!);
  
  const fetchDataPromise = getUserbyEmail(decodedToken.email); 
  const fetchTeamsPromise  = getTeamsForUser(decodedToken.id);
  const fetchMainTeamConvosPromise = getTeamConversations(decodedToken.teamAdminOf[0].id);

  const [ fetchedData, fetchedTeams ] = await Promise.all([
      fetchDataPromise, 
      fetchTeamsPromise,
      fetchMainTeamConvosPromise
  ])

  async function getTokenInfo(){
    'use server'
    return [fetchedData,fetchedTeams, decodedToken]; 
  }

  if(!decodedToken.verified){
    return (
      <>
        <Unverified /> 
      </>
    )
  } else if (decodedToken.teamAdminOf.length < 1){
      <NotTeamFound /> 
  } else {
    return (
      <>
        <ChatTemplate tokenFunction={getTokenInfo}/> 
      </>
    );
  }
}
