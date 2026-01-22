import React, { useState } from 'react'
import axios from 'axios';
import {useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({name: '', email: '', password: '', aadhaar: ''});
    const navigate = useNavigate();

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const validateAadhaar = (aadhaar) => {
        const aadhaarRegex = /^\d{12}$/;
        return aadhaarRegex.test(aadhaar);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validate form data
        if (!validateEmail(formData.email)) {
            alert('Please enter a valid email address.');
            return;
        }
        if (!validatePassword(formData.password)) {
            alert('Password must be at least 6 characters long.');
            return;
        }
        if (!validateAadhaar(formData.aadhaar)) {
            alert('Aadhaar number must be exactly 12 digits.');
            return;
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                aadhaarNumber: formData.aadhaar
            });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            const errorMessage = err.response?.data?.msg || 'An error occurred during registration.';
            alert(errorMessage);
        }
    };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Create Citizen Account</h2>
        <input type="text" placeholder="Full Name" className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        <input type="email" placeholder="Email Address" className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        <input type="text" placeholder="Aadhaar Number" className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({...formData, aadhaar: e.target.value})} required />
        <input type="password" placeholder="Password" className="w-full p-3 mb-6 border rounded-lg focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition">Register</button>
      </form>
    </div>
  )
}

export default Register