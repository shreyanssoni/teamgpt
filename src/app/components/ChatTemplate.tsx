"use client"
import { useState } from "react";
import { FiSend, FiPaperclip } from "react-icons/fi";
import { RiChatNewLine } from "react-icons/ri";
import ChatBox from "./ChatBox";

export default function ChatTemplate() {
  const [message, setMessage] = useState("");

  const handleMessageChange = (e: any) => {
    setMessage(e.target.value);
  };

  return (
    <div className="flex h-screen float text-white"> 
    <div className="bg-black w-full h-16 fixed py-4">
        <span className="text-xl font-bold p-4">TeamGPT</span>
    </div>
      <div className="m-auto max-w-4xl w-full h-screen pt-8">
        <div className="rounded-lg items-center p-6 flex flex-col h-full">
          <div className="flex-grow overflow-y-auto mb-4 p-4 px-6 rounded-lg">
            <ChatBox/> 
          </div>
          <div className="flex items-center w-full justify-center space-x-2 max-w-4xl relative" >
            <div className="flex flex-1 items-center flex-row justify-center bg-gray-700 text-white rounded-3xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600">
                <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors duration-200">
                <FiPaperclip size={24} />
                </button>
                <textarea
                placeholder="Message teamGPT"
                style={{ scrollbarWidth: 'none' }}
                className="bg-gray-700 my-auto p-1 h-full resize-none w-full focus:outline-none"
                value={message}
                rows={1}
                onChange={handleMessageChange}
                />
                <button className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors duration-200">
                <FiSend size={24} />
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
