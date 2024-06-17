import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

export default function NotTeamFound() {
  // console.log("hello")
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="max-w-md p-8 bg-gray-800 rounded-lg shadow-lg text-center">
            <Image src='/assets/download.png' width={300} height={300} alt='' /> 
            <h2 className="mt-6 text-3xl font-semibold text-white">Please, Team Up! </h2>
            <p className="text-gray-400 mt-2">Follow this link: <Link className='text-blue-500 hover:text-blue-400' href="/details">Create Team</Link></p>
          </div>
        </div>
      );
}
