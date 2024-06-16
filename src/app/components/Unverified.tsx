import React from 'react'
import Image from 'next/image';

export default function Unverified() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="max-w-md p-8 bg-gray-800 rounded-lg shadow-lg text-center">
            <Image src='/assets/download.png' width={300} height={300} alt='' /> 
            <h2 className="mt-6 text-3xl font-semibold text-white">Email not verified &#58;&#40;</h2>
            <p className="text-gray-400 mt-2">Please verify your email to proceed.</p>
          </div>
        </div>
      );
}
