import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';
import { useAuth } from '../AuthContext';
import { FolderIcon, ArrowRightIcon, PlusIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';


const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
            login(res.data.token);
            navigate('/dashboard');
        } catch (err) {
            const errorMessage = err.response?.data?.msg || 'Invalid credentials, try again 🔁';
            alert(errorMessage);
        }
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">GovVault</span>
          </div>
          <div className='space-x-4'>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </div>
        </div>
      </nav>
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Login to GovVault</h2>
        <input type="email" name='email' placeholder="Email" className="w-full p-3 mb-4 border rounded-lg" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" autoComplete='true' name='password' placeholder="Password" className="w-full p-3 mb-6 border rounded-lg" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition">Sign In</button>
        <p className="mt-4 text-center text-sm">New user? <a href="/register" className="text-indigo-600 underline">Register here</a></p>
      </form>
    </div>
  )
}

export default Login