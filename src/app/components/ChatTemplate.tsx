"use client";
import { useEffect, useRef, useState } from "react";
import { FiSend, FiPaperclip } from "react-icons/fi";
import { RiChatNewLine } from "react-icons/ri";
import ChatBox from "./ChatBox";
import { IoLogOutOutline } from "react-icons/io5";
import axios from "axios";
import { useRouter } from "next/navigation";
import SidePanel from "./SidePanel";
import styles from "./chat.module.css";
import toast, { Toaster } from "react-hot-toast";
import Dialog from "./dialog";

interface Message {
  id: number;
  content: string;
}

export default function ChatTemplate({ tokenFunction }: any) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState("");
  const [teams, setTeams] = useState([]);
  const [data, setData] = useState({});
  const [selectedTeam, setSelectedTeam] = useState(0);
  const [typing, setTyping] = useState(false);
  const [selectedConvo, setSelectedConvo] = useState<any | null>(null);
  const [convoItem, setConvoItem] = useState([]);
  const convoRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false); 
  const noCreditsRef = useRef(false);

  const handleMessageChange = (e: any) => {
    setMessage(e.target.value);
  };

  const logout = async () => {
    await axios.get("/api/users/logout");
    router.push("/login");
  };

  async function addNewMessage(msgPayload: any) {
    const newMsgAdded = await axios.post(
      "/api/conversations/addmessage",
      msgPayload
    );
    console.log(msgPayload);
    return newMsgAdded;
  }

  async function createNewConversation(payload: any, message: string) {
    try {
      const newConv = await axios.post("/api/conversations/addnew", payload);
      // console.log("printing new" , newConv.data.content[0])
      setSelectedConvo(newConv.data.content[0].id);
      convoRef.current = newConv.data.content[0].id;

      setConvoItem(newConv.data.content[0]);

      const msgPayload = {
        newMsg: message,
        convoId: newConv.data.content[0].id,
      };

      await addNewMessage(msgPayload);
      // console.log("ref", convoRef);
      return newConv.data.content[0];
    } catch (error:any) {
      if(error.response.status == 422){
        toast.error("Team Credits are low.")
        await axios.post("/api/jobs/startemailjob", {
          email: tokenFunction.email,
          emailType: 'CREDITS'
        })
        noCreditsRef.current = true;  
      } else {
        console.log(error)
        toast.error("Error saving the message.")
      }

      return "error"
    }
    
  }

  const sendMessage = async () => {
    if(noCreditsRef.current == true){
      toast.error("Team Credits are low.")
      return 
    }
    if (message) {
      if (convoRef.current == null) {
        // create a new convo in team
        console.log("Creating new convo...");
        const slug = message.split(" ").slice(0, 2).join(" ");
        // console.log(selectedTeam, slug)
        const payload = {
          slug: slug,
          teamId: selectedTeam,
        };
        console.log(payload);
        createNewConversation(payload, message);
      } else if (convoRef.current != null) {
        const msgPayload = {
          newMsg: message,
          convoId: convoRef.current,
        };
        addNewMessage(msgPayload);
      }

      setTyping(true);
      setMessages((prevMsgs: Message[]) => [
        ...prevMsgs,
        {
          id: Math.floor(Math.random() * 100),
          content: message,
        },
      ]);

      try {
        const responsePromise = axios.post("/api/conversations/llm", {
          userMessage: message,
        });

        setMessage("");
        const response = await responsePromise;
        setTyping(false);
        setMessages((prevMsgs) => [
          ...prevMsgs,
          {
            id: Math.floor(Math.random() * 100),
            content: response.data.content,
          },
        ]);
        const msgPayload = {
          newMsg: response.data.content,
          convoId: convoRef.current,
        };
        if(convoRef.current != null){
          addNewMessage(msgPayload);
        }

      } catch (error: any) {
        console.error("error", error);
        setMessages((prevMsgs) => [
          ...prevMsgs,
          {
            id: Math.floor(Math.random() * 100),
            content: "Technical difficulties...try later.",
          },
        ]);
      }
    }
  };

  const updateMessages = (values: any) => {
    // console.log();
    if (values[0]) {
      setMessages(
        values[0].sort(
          (a: any, b: any) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      );
      // setMessages(values[0]);
    } else {
      toast.error("Error loading conversations");
    }
  };

  const updateConvo = (values: any) => {
    setSelectedConvo(values);
    convoRef.current = values;
    // console.log(values);
  };

  const updateTeam = (values: any) => {
    setSelectedTeam(values);
    // console.log(values);
  };

  const handleRemoveMember = async (id: number, teamid: number) => {
    try {
      await axios.post('/api/teams/remove', {
        userid: id,
        teamid: teamid
      })
      return "removed"
    } catch (error) {
      console.error("error removing", error); 
      return "error"
    }
    
  };


  return (
    <div className="flex-1 flex-row">
      <SidePanel
        messages={messages}
        updateMessages={updateMessages}
        updateConvo={updateConvo}
        updateTeam={updateTeam}
        convoItem={convoItem}
        tokenFunction={tokenFunction}
      />
      <Toaster />
      <div className="flex h-screen float text-white">
        <div className="bg-black w-full h-16 fixed py-4">
          <button
            onClick={() => setIsOpen(true)}
            style={{border: '1px solid white', padding: '4px 8px', borderRadius: '12px', margin: 'auto 20px', boxShadow: '1px 1px 6px 1px rgba(255,255,255,0.4)' }}
          >
            Manage Your Team
          </button>
          
          {isOpen && (
            <Dialog 
              user={tokenFunction.name}
              id={tokenFunction.id}
              email={tokenFunction.email}
              team={tokenFunction.teamAdminOf[0]}
              onClose={() => setIsOpen(false)}
              onRemoveMember={handleRemoveMember}
            />
          )}

          <span
            onClick={logout}
            className="absolute cursor-pointer hover:bg-white p-1 text-white hover:text-black rounded-full"
          >
            <IoLogOutOutline size={28} />
          </span>
        </div>
        <div className="m-auto max-w-4xl w-full h-screen pt-8">
          <div className="rounded-lg items-center p-6 flex flex-col h-full">
            <div
              style={{ scrollbarWidth: "none" }}
              className="flex-grow overflow-y-auto w-full mb-4 p-4 px-6 rounded-lg "
            >
              {messages.map((item) => (
                <div key={item.id}>
                  <ChatBox type="text" content={item.content} />
                </div>
              ))}
              {typing && (
                <div>
                  <ChatBox type="load" content=". . ." />
                </div>
              )}
            </div>
            <div className="flex items-center w-full justify-center space-x-2 max-w-4xl relative">
              <div className="flex flex-1 items-center flex-row justify-center bg-gray-700 text-white rounded-3xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600">
                <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors duration-200">
                  <FiPaperclip size={24} />
                </button>
                <textarea
                  placeholder="Message teamGPT"
                  style={{ scrollbarWidth: "none" }}
                  className="bg-gray-700 my-auto p-1 h-full resize-none w-full focus:outline-none"
                  value={message}
                  rows={1}
                  onChange={handleMessageChange}
                  onKeyDown={(e: any) => {
                    if (e.key == "Enter") {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button
                  disabled={noCreditsRef.current ? true : (message ? false : true)}
                  onClick={
                    sendMessage
                  }
                  className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors duration-200"
                >
                  <FiSend size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
