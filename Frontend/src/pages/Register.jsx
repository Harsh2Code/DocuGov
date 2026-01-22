import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FolderIcon, ArrowRightIcon, PlusIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import API_BASE_URL from '../apiConfig';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', aadhaar: '' });
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
        console.log('Frontend: Starting registration process');

        // Validate form data
        if (!validateEmail(formData.email)) {
            console.log('Frontend: Email validation failed');
            alert('Please enter a valid email address.');
            return;
        }
        if (!validatePassword(formData.password)) {
            console.log('Frontend: Password validation failed');
            alert('Password must be at least 6 characters long.');
            return;
        }
        if (!validateAadhaar(formData.aadhaar)) {
            console.log('Frontend: Aadhaar validation failed');
            alert('Aadhaar number must be exactly 12 digits.');
            return;
        }

        console.log('Frontend: Validation passed, sending request to:', `${API_BASE_URL}/api/auth/register`);
        console.log('Frontend: Request data:', {
            name: formData.name,
            email: formData.email,
            aadhaarNumber: formData.aadhaar
        });

        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                aadhaarNumber: formData.aadhaar
            });
            console.log('Frontend: Registration successful, response:', res.data);
            localStorage.setItem('token', res.data.token);
            // Force a re-render by dispatching a storage event
            window.dispatchEvent(new Event('storage'));
            navigate('/dashboard');
        } catch (err) {
            console.log('Frontend: Registration error:', err);
            console.log('Frontend: Error response:', err.response);
            console.log('Frontend: Error status:', err.response?.status);
            console.log('Frontend: Error data:', err.response?.data);
            const errorMessage = err.response?.data?.msg || 'An error occurred during registration.';
            alert(errorMessage);
        }
    };
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

            <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Create Citizen Account</h2>
                <input type="text" placeholder="Full Name" className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-500" name='name' onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                <input type="email" placeholder="Email Address" className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-500" name='email' onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                <input type="text" placeholder="Aadhaar Number" className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-500" name='aadhaar' onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })} required />
                <input type="password" placeholder="Password" className="w-full p-3 mb-6 border rounded-lg focus:ring-2 focus:ring-indigo-500" name='password' onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition">Register</button>
            </form>
        </div>
    )
}

export default Register