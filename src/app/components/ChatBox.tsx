import React from "react";
import { FaUserCircle } from "react-icons/fa";

export default function ChatBox() {
  return (
    <div className="flex flex-row align-top justify-start">
        <div className="z-10 mx-2">
            <FaUserCircle size={28} />
        </div>
        <div className="text-white p-2 px-3 bg-slate-600 rounded-xl text-md">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus ex autem
        tempore id qui totam magnam placeat, quasi quidem voluptatibus illum
        ducimus quae fugit aliquam eos deserunt incidunt consectetur explicabo,
        doloribus dolores numquam veniam fugiat. Mollitia, harum ea placeat vero
        deserunt nostrum? Vel nam perspiciatis numquam molestias fugiat expedita
        laudantium!
        </div>
    </div>
  );
}
