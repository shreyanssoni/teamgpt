"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, {Toaster} from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { IoIosPeople } from "react-icons/io";
import { LuShare } from "react-icons/lu";
import { SpinningCircles } from 'react-loading-icons';


const Details: React.FC = () => {
    const router = useRouter(); 
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const createTeam = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/teams/insert', {
              name: name
            })
            
            if(response){
              toast.success(`Succesfully Created Team: ${name}`)
            }

            setTimeout(() => {
              router.push("/");
            }, 400);

            
        } catch (error: any) {
            if(error.response.status == 403){
              toast.error("User already has a team!");
            } else {
              toast.error("Error Occurred in Creating Team.");
            }
            console.log("Team Creation Failed", error);
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
          <h2 className="text-4xl font-bold text-black">Create a Team</h2>
        </div>
        <div className="space-y-6">
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name your Team *
            </label>
            <input
              id="teamname"
              name="teamname"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <button
              className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={createTeam}
            >
              { !loading && 
              <span>Create</span> 
              }
              {
                loading &&
                <SpinningCircles style={{ width: '28px', height: '28px', textAlign: 'center', margin: 'auto' }}/> 
              }
            </button>
          </div>
        </div>
        <div className="text-sm text-center">
          <a href="/" className="font-medium text-blue-600 hover:text-blue-500 flex-row flex justify-center">
            <span>Invite Members </span>
            <span> <LuShare size={16} className='text-blue-600 mx-1'/></span>
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
