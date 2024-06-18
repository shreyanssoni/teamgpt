"use client";
import React from "react";
import Image from "next/image";
import { IoLogOutOutline } from "react-icons/io5";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function Unverified({decodedToken}:any) {
  const router = useRouter();
  const logout = async () => {
    const logoutPromise =  axios.get("/api/users/logout");
    toast.promise(logoutPromise,
   {
     loading: 'Saving...',
     success: <p>Logged Out</p>,
     error: <p>Could not log out</p>,
   }
    )
    await logoutPromise; 
    router.push("/login");
  };

  const resend = async () => {
    const cookies = await decodedToken();
    // console.log(cookies.email) 
    const res = await axios.post("/api/jobs/startemailjob", {
              email: cookies.email
      })
      if(res.status == 200) {
        toast.success("Email Sent!")
      }
      else {
        toast.error("Error sending. Please try later.")
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Toaster/>
      <IoLogOutOutline
        onClick={logout}
        size={28}
        className="absolute top-5 right-5 cursor-pointer"
      />
      <div className="max-w-md p-8 bg-gray-800 rounded-lg shadow-lg text-center">
        <Image src="/assets/download.png" width={400} height={400} alt="" />
        <h2 className="mt-6 text-3xl font-semibold text-white">
          Email not verified &#58;&#40;
        </h2>
        <p className="text-gray-400 mt-2">
          Please verify your email to proceed.{" "}
          <span className="text-blue-600 cursor-pointer" onClick={resend}>Resend Email</span>
        </p>
      </div>
    </div>
  );
}
