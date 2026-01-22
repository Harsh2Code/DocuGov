import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { LuLayoutTemplate, LuView, LuUser } from "react-icons/lu";

const Dock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState('layout');

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      setActiveButton('layout');
    } else if (location.pathname === '/vault') {
      setActiveButton('view');
    } else if (location.pathname === '/profile') {
      setActiveButton('user');
    } else {
      setActiveButton('layout');
    }
  }, [location.pathname]);

  return (
    <div
      className="dock w-8/10 dock-lg mb-4 md:w-2/10 mx-auto flex justify-center items-center gap-16 bg-gray-50 p-2 py-4 fixed bottom-5 left-0 right-0 z-50 rounded-lg"
      style={{
              boxShadow: "inset rgba(255, 255, 255, 1) 1px 3px 5px, 0 3px 5px #00000030"
            }}
     >
      <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center">
        <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <LuLayoutTemplate size={"26"} />
        </svg>
        {activeButton === 'layout' && <div className="w-8 h-1 rounded-md bg-indigo-500 mt-1"></div>}
        {/* <span className="dock-label">Home</span> */}
      </button>

      <button onClick={() => navigate('/vault')} className="flex flex-col items-center">
        <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <LuView size={"26"} />
        </svg>
        {activeButton === 'view' && <div className="w-8 h-1 rounded-md bg-indigo-500 mt-1"></div>}
        {/* <span className="dock-label">Inbox</span> */}
      </button>

      <button onClick={() => navigate('/profile')} className="flex flex-col items-center">
        <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <LuUser size={"26"} />
        </svg>
        {activeButton === 'user' && <div className="w-8 h-1 rounded-md bg-indigo-500 mt-1"></div>}
        {/* <span className="dock-label">Settings</span> */}
      </button>
    </div>
  )
}

export default Dock