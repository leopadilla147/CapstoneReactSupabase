import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import logo from "../assets/logo.png"
import bg from "../assets/bg-gradient.png"
import { useNavigate } from "react-router-dom";

function BorrowedThesis() {
  const navigate= useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleBack = () => {
    navigate("/admin-homepage");
  };

  const handleLogOut = () => {
    navigate('/')
  }


  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bg})` }}>
      {/* Header */}
        <header className="w-full flex items-center justify-between px-6 py-4 text-white">
            <div className="flex items-center space-x-4">
                <img src={logo} alt="CNSC Logo" className="w-16 h-16" />
            <div>
                <h1 className="font-bold text-lg leading-tight">CAMARINES NORTE STATE COLLEGE</h1>
                <p className="text-sm">F. Pimentel Avenue, Daet, Camarines Norte, Philippines</p>
            </div>
            </div>
    
            <div className="flex items-center gap-3 relative">
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
            <button onClick={handleBack} className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md font-semibold">Back</button>
            <button onClick={handleLogOut} className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md font-semibold">Log Out</button>
            </div>
        </header>

      {/* Page Title and Search */}
      <div className="px-6 py-5">
        <h2 className="text-2xl font-bold text-white mb-1">THESIS HUB</h2>
        <p className="text-sm font-bold text-white">Student’s Borrowed Data</p>

        <div className="flex mt-4 w-full max-w-3xl">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 px-4 py-2 rounded-l-full border border-gray-300 text-sm outline-none"
          />
          <button className="bg-red-900 text-white px-5 py-2 rounded-r-full font-bold text-sm">Search</button>
        </div>

        {/* Data Table */}
        <div className="mt-8 overflow-x-auto text-black/70">
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100 font-bold">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm">Department</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm">ID No.</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm">Title</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm">Spend Time</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(4)].map((_, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BorrowedThesis