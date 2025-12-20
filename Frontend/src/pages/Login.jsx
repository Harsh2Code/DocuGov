import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const res = await axios.post('http://localhost:5000/api/auth/sync', { firebaseUID: userCredential.user.uid });
            localStorage.setItem('token',res.data.token);
            navigate('/dashboard');
        } catch (err) { alert( "Invalid Credential, try again 🔁")}
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Login to GovVault</h2>
        <input type="email" placeholder="Email" className="w-full p-3 mb-4 border rounded-lg" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full p-3 mb-6 border rounded-lg" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition">Sign In</button>
        <p className="mt-4 text-center text-sm">New user? <a href="/register" className="text-indigo-600 underline">Register here</a></p>
      </form>
    </div>
  )
}

export default Login