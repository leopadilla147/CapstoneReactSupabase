import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/bg-gradient.png';
import logo from '../assets/logo.png';

export default function ThesisHubHome() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/results?q=${encodeURIComponent(query)}`);
      }
  };

  return (
    <div
      className="w-full h-screen bg-cover bg-center bg-no-repeat flex flex-col"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <header className="w-full flex items-center justify-between px-6 py-4 text-white">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="CNSC Logo" className="w-16 h-16" />
          <div>
            <h1 className="font-bold text-lg leading-tight">CAMARINES NORTE STATE COLLEGE</h1>
            <p className="text-sm">F. Pimentel Avenue, Daet, Camarines Norte, Philippines</p>
          </div>
        </div>

        <button onClick={() => navigate('/login')} className="bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded">
          Login
        </button>
      </header>
      

      {/* Content */}
      <main className="flex flex-col items-center justify-center flex-grow text-center text-black px-4">
        <h2 className="text-5xl font-extrabold text-red-800 drop-shadow-md">THESIS HUB</h2>
        <p className="mt-3 max-w-xl text-base drop-shadow-sm">
          Search and explore student research papers from CNSC.
        </p>
        <div className="mt-8 flex items-center bg-white shadow-md rounded-full overflow-hidden border w-full max-w-2xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Research or Keywords"
            className="flex-grow p-3 text-gray-700 text-base outline-none"
          />
          <button onClick={handleSearch} className="bg-red-600 text-white px-6 py-3 hover:bg-red-800">
            Search
          </button>
        </div>
        <p className="text-xs mt-4 text-black drop-shadow-sm">Last Updated: Batch 2022 - 2023</p>
      </main>
    </div>
  );
}
