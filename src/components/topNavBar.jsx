import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // adjust path

export default function TopNavbar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/results?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex justify-between items-center bg-red-300/30 backdrop-blur-md px-8 py-4 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <img src={logo} alt="Logo" className="h-14 object-contain" />
        
        <Link to="/">
          <h2 className="text-3xl font-extrabold text-white drop-shadow-md">
            THESIS HUB
          </h2>
        </Link>
      </div>

      <div className="flex items-center bg-white border border-gray-300 rounded-full overflow-hidden">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          className="px-3 py-2 text-sm w-72 outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-red-600 text-white px-4 py-2 text-sm hover:bg-red-800"
          aria-label="Search"
        >
          🔍︎
        </button>
      </div>
    </div>
  );
}
