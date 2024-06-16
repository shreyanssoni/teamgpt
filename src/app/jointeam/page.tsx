"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, {Toaster} from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { IoIosPeople } from "react-icons/io";
import { LuShare } from "react-icons/lu";
import { checkMemberShip } from '@/drizzle/db';
import { SpinningCircles } from 'react-loading-icons';


const Details: React.FC = () => {
    const router = useRouter(); 
    const param = decodeURIComponent(window.location.search);
    const teamName = param.split("=")[1].split("&")[0];
    const teamId = param.split("=")[2];
    const [loading, setLoading] = useState(false);

    const joinTeam = async () => {
        try {
            setLoading(true);
            await axios.post("/api/teams/join", {
              teamName: teamName,
              teamId: teamId
            })
            
            toast.success(`Added to the team: ${teamName}`);
            router.push("/");

        } catch (error: any) {
            if(error.response.status == 402){
              toast.error(`User Already in Team!`);
              router.push('/');
            } else {
              toast.error(`Error adding to team.`);
            }
            console.log("Team Joining Failed", error);
        } finally {
            setLoading(false);
        }

    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100" style={{ backgroundImage: 'url(assets/bg.jpg)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundColor: 'black', backgroundPositionX: '30%' }}>
      <Toaster /> 
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center mb-4 text-4xl ">
            <IoIosPeople size={38} className='text-black' />
          </div>
          <h2 className="text-3xl font-bold text-black">Team Invite: <span className='text-purple-600'>{teamName}</span></h2>
        </div>
        <div className="space-y-4">
          <div>
            <button
              className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={joinTeam}
            >
              { !loading && 
              <span>Join Team</span> 
              }
              {
                loading &&
                <SpinningCircles style={{ width: '28px', height: '28px', textAlign: 'center', margin: 'auto' }}/> 
              }
            </button>
          </div>
        </div>
        <div className="mt-1 text-sm text-center">
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            <span>Want your own Team? Join Us</span>
          </a>
        </div>
        <p className="mt-6 text-xs text-center text-gray-400">
        teamGPT © Shreyans Soni.
        </p>
      </div>
    </div>
  );
};

export default Details;
