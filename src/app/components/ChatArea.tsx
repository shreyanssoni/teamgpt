import React from 'react'
import ChatBox from "./ChatBox";
import { FiSend, FiPaperclip } from "react-icons/fi";

export default function ChatArea({ messages, typing, message, handleMessageChange, sendMessage, noCreditsRef}: any) {
  return (
    <div className="m-auto max-w-4xl w-full h-screen pt-8">
    <div className="rounded-lg items-center p-6 flex flex-col h-full">
      <div
        style={{ scrollbarWidth: "none" }}
        className="flex-grow overflow-y-auto w-full mb-4 p-4 px-6 rounded-lg "
      >
        {messages.map((item: any) => (
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
      <div
        className={`flex items-center w-full justify-center space-x-2 max-w-4xl relative`}
      >
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
            disabled={
              noCreditsRef.current ? true : message ? false : true
            }
            onClick={sendMessage}
            className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors duration-200"
          >
            <FiSend size={24} />
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}
