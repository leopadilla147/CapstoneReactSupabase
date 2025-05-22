import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../connect-supabase.js';
import logo from '../assets/logo.png';
import bg from '../assets/bg-gradient.png';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('id, username, password, role')
        .eq('username', username)
        .maybeSingle();

      if (error || !user) {
        setError('User not found');
        return;
      }

      if (user.password !== password) {
        setError('Incorrect password');
        return;
      }

      if (user.role === 'admin') {
        navigate('/admin-homepage');
      } else {
        navigate('/user');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 py-4 text-white">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="CNSC Logo" className="w-16 h-16" />
          <div>
            <h1 className="font-bold text-lg leading-tight">CAMARINES NORTE STATE COLLEGE</h1>
            <p className="text-sm">F. Pimentel Avenue, Daet, Camarines Norte, Philippines</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mt-10 text-center w-full max-w-md px-4">
        <h2 className="text-5xl font-extrabold text-red-800 drop-shadow-md">THESIS HUB</h2>
        <p className="text-sm text-gray-800 mb-8">
          Thesis Hub is a platform where students can search and access peers’ research,
          fostering collaboration and learning.
        </p>

        {/* Login Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded text-sm"
          />
          <button
            onClick={handleLogin}
            className="w-full p-3 bg-red-800 hover:bg-red-900 text-white font-semibold rounded text-base transition"
          >
            LOGIN
          </button>
          {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
