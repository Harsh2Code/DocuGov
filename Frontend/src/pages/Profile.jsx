import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { supabase } from '../supabase';
import Dock from '../components/Dock';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const res = await axios.put('http://localhost:5000/api/auth/profile', formData, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Profile picture updated successfully!');
      setUser(res.data.user);
      fetchProfile(); // Refresh to get new signed URL
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      setMessage('Error uploading profile picture. Please try again.');
    } finally {
      setUploading(false);
    }
  };


  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">GovVault</span>
          </div>
          <button onClick={handleLogout} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            Logout
          </button>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-sm sm:max-w-md lg:max-w-lg mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">Profile</h1>

          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-full overflow-hidden mb-4">
              {user?.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                  No Image
                </div>
              )}
            </div>

            <label className="cursor-pointer bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base hover:bg-blue-600">
              {uploading ? 'Uploading...' : 'Change Profile Picture'}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {message && (
            <div className={`text-center mb-4 text-sm sm:text-base ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </div>
          )}

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm sm:text-base">
                {user?.name}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm sm:text-base">
                {user?.email}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
              <p className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm sm:text-base">
                {user?.aadhaarNumber}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Dock />
    </div>
  );
};

export default Profile;
