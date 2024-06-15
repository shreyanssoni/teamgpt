"use client"
import React, { useState } from 'react';
import axios from 'axios';
import toast, {Toaster} from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const SignupPage: React.FC = () => {
    const router = useRouter(); 
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");

    const onSignUp = async () => {
        try {
            setLoading(true);
            const userdetails = {
                name: name,
                email: email, 
                password: password
            }
            
            await axios.post("api/users/signup", userdetails);    
            toast.success("Successfully Logged In!");
            router.push('login');
            
        } catch (error: any) {
            if(error.response.status == 409){
                toast.error("User Already Exists!");
            } else {
                toast.error("Error signing in.");
            }
            console.log("Signin Failed", error);
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
            <span role="img" aria-label="lock" className='bg-purple-600 rounded-full py-2 px-1'>🔒</span>
          </div>
          <h2 className="text-4xl font-bold text-black">Sign Up</h2>
        </div>
        <div className="space-y-6">
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <button
              className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onSignUp}
            >
              Sign Up
            </button>
          </div>
        </div>
        <div className="text-sm text-center">
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            <span>Already have an account? Sign In</span>
          </a>
        </div>
        <p className="mt-6 text-xs text-center text-gray-400">
        teamGPT © Shreyans Soni.
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
