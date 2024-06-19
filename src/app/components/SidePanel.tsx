"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  AiFillDashboard,
  AiOutlinePlusSquare,
  AiOutlineHistory,
} from "react-icons/ai";
import { RiChatNewLine } from "react-icons/ri";
import { IoMdList } from "react-icons/io";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { FaCoins } from "react-icons/fa6";
import axios from "axios";
import { SpinningCircles } from 'react-loading-icons';
import styles from './chat.module.css'

const SidePanel = ({ messages, updateMessages, updateConvo, updateTeam, convoItem, tokenFunction, updateloading }: any) => {
  const [username, setUsername] = useState("");
  const [teams, setTeams] = useState<any[]>([]);
  const [convoslist, setConvoslist] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedConvo, setSelectedConvo] = useState(null); 
  const [convoloading, setConvoloading] = useState(false);
  // const creditsRef = useRef<number | string>("no conversation selected");  
  const [credits, setCredits] = useState<number | string>("no conversation selected");  

  async function changeConvo(item: any){
    updateloading(true); 
    if(selectedConvo != item.id){
      updateConvo(item.id); 
      setSelectedConvo(item.id);
      // setConvoloading(true); 
      // updateMessages([]); 
      const messagesList = await axios.post('/api/conversations/fetchMessages', {
        convId: item.id
      }); 
      
      updateMessages([messagesList.data.content].sort((a:any,b:any) => ( a.createdAt.getTime() - b.createdAt.getTime() )));
      setConvoloading(false); 
    }

    setConvoloading(false); 
    updateloading(false); 
    
    // console.log("list" , messagesList.data)
  }

  const updateCredits = async (teamId: number | null) => {
    try{
      setCredits("...");
      const newCredits = await axios.post('/api/teams/getcredits', {
          teamId: teamId
      });
      setCredits( newCredits.data.content[0].credits);

    } catch (error: any) {
      console.log("error msg fetching credits", error); 
    }
    }

  useEffect(()=>{
    // console.log("convo item changed...,", convoItem)
    setConvoloading(true);
    // if(convoItem.length > 0){
    if(convoItem && convoItem.id){
      setConvoslist((prevList) => [convoItem, ...prevList]); 
      updateCredits(selectedTeam);
    }
    // }
    setConvoloading(false); 
  }, [convoItem])

  const fetchConversations = async (selectedTeam: number) => {
    setConvoloading(true);
    const convos = await axios.post('/api/conversations/fetchconvos', {
      teamId: selectedTeam
    })

    if(convos.status  && selectedTeam){
      const retrievedConvos = convos.data.content; 
      if(retrievedConvos.length > 0){
        setConvoslist(retrievedConvos.sort((a : any, b: any) =>  
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ));
      }
      // setConvoslist(retrievedConvos);
    }

    setConvoloading(false); 
    return convos.data.content || []; 
  }

  const fetchTeams = async (userid: number) => {
    const teams = await axios.post('/api/conversations/fetchTeams', {
      userid: userid
    })
    // console.log("teams", teams.data.content);
    setTeams(teams.data.content);
    return "success"
  }

  useEffect(() => { //initial load...
    setConvoloading(true);
    const tokenData = tokenFunction; 
    setUsername(tokenData.name);

    if(selectedTeam == null){
      setSelectedTeam(tokenData.teamAdminOf[0].id);
      updateCredits(tokenData.teamAdminOf[0].id); 
      updateTeam(tokenData.teamAdminOf[0].id); 
      //fetch all the team convos async; 
      setTeams(tokenData.teamAdminOf); 
      fetchConversations(tokenData.teamAdminOf[0].id); 
      fetchTeams(tokenData.id);
    }

    setConvoloading(false);
  }, []);

  const newChat = () => {
    setSelectedConvo(null);
    updateConvo(null); 
    updateMessages([[]]);
  }

  useEffect(() => {
    // fetch the team details ? => and load the convos ? 
    fetchConversations(selectedTeam || 0); 
    setSelectedConvo(null);
    // fetchCredits(selectedTeam || 0)
  }, [selectedTeam])

  return (
    <div style={{ width: '18em', backgroundColor: '#20232b' }} className="float-left pl-1 h-screen text-white flex flex-col shadow-lg">
      <div style={{ backgroundColor: '#20232b' }} className="flex p-4 items-center justify-start bg-gray-800 mb-6">
        <div className="font-bold text-2xl ml-7 ">TeamGPT</div>
      </div>
      <div className="flex flex-row">
      <div onClick={newChat} style={{ backgroundColor: '#c9dfff' }} className="flex items-center ml-2 w-fit p-2 text-black hover:bg-gray-700 hover:text-gray-800 cursor-pointer rounded-3xl transition duration-75">
        <RiChatNewLine className="ml-1" size={19} />
        <span className="px-2 pl-3 text-sm">New Chat</span>
      </div>
      <div style={{ backgroundColor: '#16191e' }} className="border border-gray-400 flex items-center w-fit ml-2 p-2 text-white hover:bg-gray-700 rounded-3xl">
      <FaCoins className="pl-1" size={19}/>
        <span className="px-1 pl-2 text-sm">Credits: </span><span className="text-sm pr-2 text-gray-200">{credits}</span>
      </div>
      </div>
      
      <div className="flex-grow px-2 mt-7">
        <span className="text-sm px-2">Recents</span>
        <ul
          className="flex flex-col justify-start py-2 items-cente h-full rounded-lg overflow-y-scroll"
          style={{ scrollbarWidth: "thin", scrollbarColor: 'gray #20232b', scrollbarGutter: 'stable', maxHeight: '25em', backgroundColor: '#20232b' }}
        >{
          convoloading && (
            <SpinningCircles style={{ width: '28px', height: '28px', textAlign: 'center', margin: 'auto' }}/> 

          )
        } {
          !convoloading && (
            convoslist.map((item) => (
              <li
                key={item?.id}
                className="flex w-64 justify-between px-4 rounded-2xl items-center py-2 hover:bg-gray-700 cursor-pointer transition duration-300 ease-in-out"
                onClick={() => changeConvo(item)}
              >
                <span className="text-sm flex flex-row items-center">
                  {" "}
                  <IoMdList className="mr-3" size={16} />
                  {item?.slug}
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
      <div style={{ backgroundColor: '#20232b' }} className="mt-auto flex flex-col items-center mb-1 px-1 py-4 text-gray-400">
        <div className="w-full px-3">
          <label htmlFor="footer-select" className="block text-xs mb-1 ">
            Select Team
          </label>
          <div className={styles.customselectarrow}>
          <select
            id="footer-select"
            className={`w-full border border-gray-800 text-sm rounded-3xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-500 ${styles.selectBar}`}
            style={{ backgroundColor: '#16191e' }}
            onChange={(e)=> {
              setSelectedTeam(teams[e.target.options.selectedIndex]?.teams?.id);
              // console.log(teams[0]teams.id
              updateCredits(teams[e.target.options.selectedIndex]?.teams?.id);
            }}
            defaultValue={tokenFunction.teamAdminOf[0].id}
            defaultChecked={true}
          >
            {teams.map((item, index) => (
              <option id={item?.teams?.id} selected={item?.teams?.id == tokenFunction.teamAdminOf[0].id ? true : false} key={item?.teams?.id}>{item?.teams?.name}</option>
            ))}
          </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
