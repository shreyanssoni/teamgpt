"use client"
import React from 'react';
import { AiFillDashboard, AiOutlinePlusSquare, AiOutlineHistory } from 'react-icons/ai';
import { RiChatNewLine } from "react-icons/ri";
import { IoMdList } from "react-icons/io";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

const SidePanel = () => {
  return (
    <div className="float-left w-72 pl-1 h-screen bg-gray-800 text-white flex flex-col shadow-lg">
      <div className="flex p-4 items-center justify-start bg-gray-800 my-3 mb-6">
        <div className="font-bold text-2xl">TeamGPT</div>
      </div>
    <div className="flex items-center ml-3 mb-2 w-fit py-2 bg-gray-900 hover:bg-gray-700 hover:text-gray-200 cursor-pointer p-2 rounded-3xl transition duration-75">
        <RiChatNewLine className='ml-1' size={19}/> 
        <span className='px-2 pl-3 text-sm'>New Chat</span>
    </div> 
    <div className="flex-grow px-2 mt-4">
    <span className="text-sm px-2">Recents</span>
        <ul className="mt-2 flex flex-col justify-start py-2 items-center bg-slate-900 h-full rounded-lg overflow-y-scroll" style={{ scrollbarWidth: 'none' }}>
          <li className="flex w-64 justify-between px-4 rounded-2xl items-center py-2 hover:bg-gray-700 cursor-pointer transition duration-300 ease-in-out">
            <span className='text-sm flex flex-row items-center'> <IoMdList className='mr-3' size={16} />
                Dashboard this is me...
            </span>
            <div className='hover:bg-gray-600 p-1 rounded-full z-20'>
                <PiDotsThreeOutlineVerticalFill/>
            </div>
          </li>   
            
        </ul>
      </div>
      <div className="mt-auto flex flex-col items-center py-4 bg-gray-800 text-gray-400">
        <div className="w-full px-4">
          <label htmlFor="footer-select" className="block text-xs mb-1">Select Team</label>
          <select id="footer-select" className="w-full bg-gray-700 border border-gray-600 text-sm rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-gray-500">
            <option>Team 1</option>
            <option>Team 2</option>
            <option>Team 3</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
