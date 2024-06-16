"use client";
import React, { useState, useEffect } from "react";
import {
  AiFillDashboard,
  AiOutlinePlusSquare,
  AiOutlineHistory,
} from "react-icons/ai";
import { RiChatNewLine } from "react-icons/ri";
import { IoMdList } from "react-icons/io";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { getUserbyEmail } from "@/drizzle/db";
import axios from "axios";
import { SpinningCircles } from 'react-loading-icons';


const SidePanel = ({ messages, updateMessages, tokenFunction }: any) => {
  const [username, setUsername] = useState("");
  const [teams, setTeams] = useState<string[]>([]);
  const [tokenData, setTokenData] = useState({});
  const [data, setData] = useState({});
  const [convoslist, setConvoslist] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState();
  const [selectedConvo, setSelectedConvo] = useState(null); 
  const [convoloading, setConvoloading] = useState(false); 

  async function changeConvo(item: any){
    setSelectedConvo(item.id);
    const messagesList = await axios.post('/api/conversations/fetchMessages', {
      convId: item.id
    }); 
    updateMessages([messagesList.data.content].sort((a:any,b:any) => ( a.createdAt.getTime() - b.createdAt.getTime() )));
    // console.log("list" , messagesList.data)
  }

  const fetchConversations = async (selectedTeam: number) => {
    setConvoloading(true);
    const convos = await axios.post('/api/conversations/fetchconvos', {
      teamId: selectedTeam
    })

    console.log("convos", convos); 

    if(convos.status  && selectedTeam){
      const retrievedConvos = convos.data.content; 
      // setConvoslist(retrievedConvos.sort((a : any, b: any) =>  b.updatedAt.getTime() - a.updatedAt.getTime()));
      setConvoslist(retrievedConvos); 
    }
    setConvoloading(false); 
    return convos.data.content || []; 
  }

  useEffect(() => {
    setConvoloading(true);
    async function getData() {
      const [fetchData, fetchTeams, decodedToken] = await tokenFunction();
      setUsername(fetchData[0].name);
      setData(fetchData[0]);
      const teamsArr = fetchTeams; 
      teamsArr.unshift({teams: decodedToken.teamAdminOf[0]})
      setTeams(teamsArr);
      if(!selectedTeam){
        fetchConversations(decodedToken.teamAdminOf[0].id);
      }
      setConvoloading(false);
      setSelectedTeam(decodedToken.teamAdminOf[0].id);
    }
    getData();
  }, [tokenFunction],);

  const newChat = () => {
    setSelectedConvo(null);
    updateMessages([[]]);
  }

  useEffect(() => {
    // fetch the team details ? => and load the convos ? 
    fetchConversations(selectedTeam); 
    setSelectedConvo(null);

  }, [selectedTeam])

  async function addNewMessage(msgPayload: any){
    const newMsgAdded = await axios.post('/api/conversations/addmessage', msgPayload)
    console.log(msgPayload);
    return newMsgAdded; 
}

  async function createNewConversation(payload: any){
    const newConv = await axios.post('/api/conversations/addnew', payload);
    // console.log("printing new" , newConv.data.content[0])
    setSelectedConvo(newConv.data.content[0].id);
    const msgPayload = {
      newMsg : messages[messages.length - 1].content,
      convoId : newConv.data.content[0].id
    }

    await addNewMessage(msgPayload);
    return newConv.data.content[0]; 
  }   

  useEffect(() => {
    console.log("update this", messages);
    console.log("selected convo", selectedConvo); 
    // check if selected convo is null == create new conversation and provide the value 
    // update the message in table 
    if(selectedConvo == null && messages.length > 0){
      const slug = messages[0].content.split(" ").slice(0,2).join(" ")  
      // console.log(selectedTeam, slug)
      const payload = {
        slug: slug,
        teamId: selectedTeam
      }
      console.log(payload)
      createNewConversation(payload); 
    } else if (selectedConvo != null) {
      const msgPayload = {
        newMsg : messages[messages.length - 1].content,
        convoId : selectedConvo
      }
      addNewMessage(msgPayload); 
    }

  }, [messages])

  return (
    <div className="float-left w-72 pl-1 h-screen bg-gray-800 text-white flex flex-col shadow-lg">
      <div className="flex p-4 items-center justify-start bg-gray-800 my-3 mb-6">
        <div className="font-bold text-2xl">Hi, {username}</div>
      </div>
      <div onClick={newChat} className="flex items-center ml-3 mb-2 w-fit py-2 bg-gray-900 hover:bg-gray-700 hover:text-gray-200 cursor-pointer p-2 rounded-3xl transition duration-75">
        <RiChatNewLine className="ml-1" size={19} />
        <span className="px-2 pl-3 text-sm">New Chat</span>
      </div>
      <div className="flex-grow px-2 mt-4">
        <span className="text-sm px-2">Recents</span>
        <ul
          className="mt-2 flex flex-col justify-start py-2 items-center bg-slate-900 h-full rounded-lg overflow-y-scroll"
          style={{ scrollbarWidth: "none", maxHeight: '25em' }}
        >{
          convoloading && (
            <SpinningCircles style={{ width: '28px', height: '28px', textAlign: 'center', margin: 'auto' }}/> 

          )
        } {
          !convoloading && (
            convoslist.map((item) => (
              <li
                key={item.id}
                className="flex w-64 justify-between px-4 rounded-2xl items-center py-2 hover:bg-gray-700 cursor-pointer transition duration-300 ease-in-out"
                onClick={() => changeConvo(item)}
              >
                <span className="text-sm flex flex-row items-center">
                  {" "}
                  <IoMdList className="mr-3" size={16} />
                  {item.slug}
                </span>
                <div className="hover:bg-gray-600 p-1 rounded-full z-20">
                  <PiDotsThreeOutlineVerticalFill />
                </div>
              </li>
            ))
          )
        }
          
        </ul>
      </div>
      <div className="mt-auto flex flex-col items-center py-4 bg-gray-800 text-gray-400">
        <div className="w-full px-4">
          <label htmlFor="footer-select" className="block text-xs mb-1">
            Select Team
          </label>
          <select
            id="footer-select"
            className="w-full bg-gray-700 border border-gray-600 text-sm rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-gray-500"
            onChange={(e)=> {
              setSelectedTeam(teams[e.target.options.selectedIndex].teams.id)
              // console.log(teams[0]teams.id
            }}
            defaultValue={0}
          >
            {teams.map((item, index) => (
              <option selected={item.teams.id == teams[0].teams.id ? true : false} id={item.teams.id} key={item.teams.id}>{item.teams.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;