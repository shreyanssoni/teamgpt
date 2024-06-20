"use client";
import React, { useState, useEffect } from "react";
import ConversationContext from "./ConversationsContext";
import axios from "axios";

interface Message {
  id: number;
  content: string;
}

export const ConversationsContextProvider = ({ children }: any) => {
  const [convos, setConvos] = useState(null);
  const [token, setToken] = useState(null);
  const [convoItem, setConvoItem] = useState([]);
  const [messages, setMessages] = useState<Message[] | []>([]);
  const [message, setMessage] = useState('');

  const getCookies = async () => {
    const decodedToken: any = await axios.post("/api/getcookies", {
      pass: "COOKIES",
    });
    setToken(decodedToken.data.content);
    return decodedToken.data.content;
  };

  useEffect(() => {
    getCookies();
  }, []);

  return (
    <ConversationContext.Provider
      value={{ convos, setConvos, 
        token, setToken, 
        convoItem, setConvoItem,
        messages, setMessages,
        message, setMessage
    }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
