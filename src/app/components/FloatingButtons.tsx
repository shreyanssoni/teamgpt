import React from 'react'

export default function FloatingButtons() {
  return (
    <div className="flex justify-around mb-8" style={{ position: "absolute" }}>
          <button className="flex-1 mx-2 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200">
            Experience Seoul like a local
          </button>
          <button className="flex-1 mx-2 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200">
            Make me a personal webpage
          </button>
          <button className="flex-1 mx-2 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200">
            Overcome procrastination
          </button>
          <button className="flex-1 mx-2 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200">
            Thank my interviewer
          </button>
    </div>
  )
}
