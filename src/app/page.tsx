"use client";
import { getTokenData } from "@/helpers/getTokenData";
import ChatTemplate from "./components/ChatTemplate";
import Unverified from "./components/Unverified";
import NotTeamFound from "./components/NoTeamFound";
import { NextRequest } from "next/server";
// import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import {
  getTeamsForUser,
  getUserbyEmail,
  getTeamConversations,
} from "@/drizzle/db";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SpinningCircles } from "react-loading-icons";
import styles from './components/chat.module.css'; 
import ConversationContext from "./contexts/ConversationsContext";
import { ConversationsContextProvider } from "./contexts/ConversationContextProvider";

export default function Home() {
  const router = useRouter();

  const [token, setToken] = useState<any | null>();
  const [isLoading, setIsLoading] = useState(true);

  const getCookies = async () => {
    const decodedToken: any = await axios.post("/api/getcookies", {
      pass: "COOKIES",
    });
    setToken(decodedToken.data.content);
    return decodedToken.data.content;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const decToken = await getCookies();
        setToken(decToken);
      } catch (error) {
        // Handle error
        alert("page token not responding...");
        console.log("error");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  try {
    if (isLoading) {
      return (
        <>
        <div className="flex justify-center items-center h-screen w-screen">
          {/* <div className="text-white-100 text-center font-bold mr-1">Loading</div> */}
          <div className={styles.loader}></div>
        </div>
        </>
    )
    } else {
      if (!token.verified) {
        return (
          <>
            <Unverified decodedToken={getCookies} />
          </>
        );
      } else if (token.teamAdminOf.length < 1) {
        <NotTeamFound />;
      } else {
        return (
          <ConversationsContextProvider>
            <ChatTemplate tokenFunction={token} />
          </ConversationsContextProvider>
        );
      }
    }
  } catch (error) {
    axios.get("/api/users/logout");
    router.push("/login");
  }
}
