import React from "react";
import { FaUserCircle } from "react-icons/fa";
import styles from './chat.module.css'

export default function ChatBox({type, content, color } : any) {
  return (
    <div className="flex flex-row align-top justify-start float-left w-full mb-3">
        <div className="z-10 mx-2">
            <FaUserCircle size={28} />
        </div>
        <div style={{ backgroundColor: color }} className="p-2 px-3 rounded-xl text-md">
        <div className={type=="load" ? styles.typing : styles.untyping}>
          {content}
        </div>
        </div>
    </div>
  );
}
