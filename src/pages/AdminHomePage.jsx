import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from "../assets/logo.png"
import bg from "../assets/bg-gradient.png"
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
  };

  const handleLogOut = () => {
    navigate('/')
  }


  return (
    <div className="min-h-screen w-screen bg-cover bg-center bg-no-repeat flex flex-col font-sans" style={{ backgroundImage: `url(${bg})` }}>
      
      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 py-4 text-white">
        <div className="flex items-center space-x-4">
            <img src={logo} alt="CNSC Logo" className="w-16 h-16" />
        <div>
            <h1 className="font-bold text-lg leading-tight">CAMARINES NORTE STATE COLLEGE</h1>
            <p className="text-sm">F. Pimentel Avenue, Daet, Camarines Norte, Philippines</p>
        </div>
        </div>

        <div className="flex items-center gap-4 relative">
          <div className="relative">
            <Bell className="text-white cursor-pointer" onClick={toggleNotifications} />
            {showNotifications && (
              <div className="absolute top-8 right-0 bg-white text-black p-4 rounded-xl shadow-lg w-60 animate-fadeIn z-50">
                <p className="font-bold text-[#7d0010] mb-2">Notifications</p>
                <ul className="text-sm space-y-2">
                  <li className="border-b pb-1">1 new thesis uploaded</li>
                  <li className="border-b pb-1">Student borrowed a thesis</li>
                  <li>System backup completed</li>
                </ul>
              </div>
            )}
        </div>

          <button onClick={handleLogOut} className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md font-semibold">
            Log Out
          </button>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex justify-center pt-16">
        <div className="text-center max-w-2xl w-full px-4">
          <h2 className="text-5xl font-bold text-[#990000] mb-5">THESIS HUB</h2>
          <p className="text-base text-gray-800 mb-10">
            Thesis Hub is a platform where students can search and access peers’ research, fostering collaboration and learning.
          </p>

          {/* Buttons Grid */}
          <div className="grid grid-cols-2 gap-10 justify-items-center">
            <Link to="/add-thesis-page">
                <button className="bg-red-800 hover:bg-red-700 text-white font-bold text-xl w-[330px] h-[130px] rounded-xl transform transition hover:scale-105 flex items-center justify-center text-center">
                    Adding of Thesis
                </button>
            </Link>

            <Link to="/borrowed-thesis">
                <button className="bg-red-800 hover:bg-red-700 text-white font-bold text-xl w-[330px] h-[130px] rounded-xl transform transition hover:scale-105 flex items-center justify-center text-center">
                    Student’s Borrowed Thesis
                </button>
            </Link>
            {/* <button className="col-span-2 bg-red-800 hover:bg-red-700 text-white font-bold text-xl py-8 px-12 rounded-xl w-[330px] transform transition hover:scale-105">
              Viewing of Thesis
            </button> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
