import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {ShieldCheckIcon} from '@heroicons/react/24/solid';

const Navbar = () => {
    const navigate = useNavigate();
    const token  = localStorage.getItem('token');

    const handleLogout = () => {
        signOut(auth).then(() => {
            localStorage.removeItem('token');
            navigate('/login');
        });
    };

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-indigo-600">
          <ShieldCheckIcon className="h-8 w-8" />
          <span className="text-xl font-bold text-gray-800">GovVault</span>
        </Link>

        {/* Links */}
        <div className="space-x-4">
          {!token ? (
            <>
              <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">Login</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Register</Link>
            </>
          ) : (
            <>
              <button 
                onClick={handleLogout} 
                className="text-red-500 hover:text-red-700 font-medium border border-red-200 px-3 py-1 rounded-md"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar