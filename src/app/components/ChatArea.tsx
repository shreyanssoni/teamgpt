import React from 'react'
import ChatBox from "./ChatBox";
import { FiSend, FiPaperclip } from "react-icons/fi";
import { IoSend } from "react-icons/io5";

export default function ChatArea({ messages, typing, message, handleMessageChange, sendMessage, noCreditsRef}: any) {
  return (
    <div className="m-auto max-w-4xl w-full h-screen pt-8">
    <div className="rounded-lg items-center p-6 flex flex-col h-full">
      <div
        style={{ scrollbarWidth: "none" }}
        className="flex-grow overflow-y-auto w-full mb-4 p-4 px-6 rounded-lg "
      >
        {messages.map((item: any, index: number) => (
          <div key={item.id}>
            <ChatBox type="text" content={item.content} color={index%2 == 0 ? '#313336': '#303647'}/>
          </div>
        ))}
        {typing && (
          <div>
            <ChatBox type="load" content=". . ." />
          </div>
        )}
      </div>
      <div
        className={`flex items-center w-full justify-center space-x-2 max-w-4xl relative`}
      >
        <div style={{ backgroundColor: '#1e1f20' }} className="flex flex-1 items-center flex-row justify-center  text-white rounded-3xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600">
          <button style={{ backgroundColor: '#1e1f20' }} className="p-2  rounded-full hover:bg-gray-600 transition-colors duration-200">
            <FiPaperclip size={24} />
          </button>
          <textarea
            placeholder="Message teamGPT"
            style={{ scrollbarWidth: 'none', backgroundColor: '#1e1f20' }}
            className="my-auto p-1 h-full resize-none w-full focus:outline-none"
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
            disabled={
              noCreditsRef.current ? true : message ? false : true
            }
            onClick={sendMessage}
            className="p-2  rounded-2xl hover:bg-blue-500 transition-colors duration-200"
          >
           <IoSend size={24} style={{ color: '#deebfc' }} />
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}
