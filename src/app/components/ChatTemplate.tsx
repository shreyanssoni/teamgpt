"use client";
import { useEffect, useState } from "react";
import { FiSend, FiPaperclip } from "react-icons/fi";
import { RiChatNewLine } from "react-icons/ri";
import ChatBox from "./ChatBox";
import { IoLogOutOutline } from "react-icons/io5";
import axios from "axios";
import { useRouter } from "next/navigation";
import SidePanel from "./SidePanel";
import styles from './chat.module.css'

export default function ChatTemplate({ tokenFunction }: any) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [teams, setTeams] = useState([]);
  const [data, setData] = useState({});
  const [selectedTeam, setSelectedTeam] = useState(0);
  const [typing, setTyping] = useState(false); 

  const handleMessageChange = (e: any) => {
    setMessage(e.target.value);
  };

  const logout = () => {
    axios.get("/api/users/logout");
    router.push("/login");
  }

  const sendMessage = async () => {
    if(message){
      // console.log(message); 
      setTyping(true); 
      setMessages((prevMsgs) => [...prevMsgs, {
        id: Math.floor(Math.random() * 100),
        content: message
      }]);
      
      const responsePromise = axios.post('/api/conversations/llm', {
        userMessage: message
      })
      
      setMessage("");
      const response = await responsePromise;
      setTyping(false); 
      setMessages((prevMsgs) => [...prevMsgs, {
        id: Math.floor(Math.random() * 100),
        content: response.data.content
      }]);
      
    }
  }

  const updateMessages = (values: any) => {
    // setMessages(values.sort((a : any ,b : any) => (a.createdAt.getTime() - b.createdAt.getTime()))); 
    setMessages(values[0]); 
    console.log(values[0]);
  }


  return (
    <div className="flex-1 flex-row">
      <SidePanel messages={messages} updateMessages={updateMessages} tokenFunction={tokenFunction} />
      <div className="flex h-screen float text-white">
        <div className="bg-black w-full h-16 fixed py-4">
          <span className="text-xl font-bold p-4">TeamGPT</span>
          <span
            onClick={logout}
            className="absolute cursor-pointer hover:bg-white p-1 text-white hover:text-black rounded-full"
          >
            <IoLogOutOutline size={24} />
          </span>
        </div>
        <div className="m-auto max-w-4xl w-full h-screen pt-8">
          <div className="rounded-lg items-center p-6 flex flex-col h-full">
            <div style={{ scrollbarWidth: 'none'}} className="flex-grow overflow-y-auto w-full mb-4 p-4 px-6 rounded-lg ">
              {
                messages.map((item, index) => (
                  <div key={item.id}>
                    <ChatBox type="text" content={item.content}/>
                  </div> 
                ))
              }
              {
                typing && (
                  <div>
                    <ChatBox type="load" content=". . ."/>
                  </div> 
                )
              }
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
                  onKeyDown={(e:any) => {
                    if(e.key == "Enter"){
                      e.preventDefault();  
                      sendMessage();
                    }

                  }}  
                />
                <button disabled={message ? false : true}  onClick={sendMessage} className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors duration-200">
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
