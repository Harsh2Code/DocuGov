import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { LuLayoutTemplate, LuView, LuUser } from "react-icons/lu";

const Dock = () => {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState('layout');

  return (
    <div
      className="dock dock-lg w-2/10 mx-auto flex justify-center items-center gap-16 bg-gray-50 p-2 py-4 fixed bottom-5 left-0 right-0 z-50 rounded-lg"
      style={{
              boxShadow: "inset rgba(255, 255, 255, 1) 1px 3px 5px, 0 3px 5px #00000030"
            }}
     >
      <button onClick={() =>{ setActiveButton('layout'); navigate('/dashboard')}} className="flex flex-col items-center">
        <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <LuLayoutTemplate size={"26"} />
        </svg>
        {activeButton === 'layout' && <div className="w-8 h-1 rounded-md bg-black mt-1"></div>}
        {/* <span className="dock-label">Home</span> */}
      </button>

      <button onClick={() => {setActiveButton('view'); navigate('/vault')}} className="flex flex-col items-center">
        <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <LuView size={"26"} />
        </svg>
        {activeButton === 'view' && <div className="w-8 h-1 rounded-md bg-black mt-1"></div>}
        {/* <span className="dock-label">Inbox</span> */}
      </button>

      <button onClick={() => {setActiveButton('user'); navigate('/')}} className="flex flex-col items-center">
        <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <LuUser size={"26"} />
        </svg>
        {activeButton === 'user' && <div className="w-8 h-1 rounded-md bg-black mt-1"></div>}
        {/* <span className="dock-label">Settings</span> */}
      </button>
    </div>
  )
}

export default Dock