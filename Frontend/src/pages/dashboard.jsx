import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

import DocList from '../components/DocList'; // The file we created earlier
import DocUpload from '../components/DocUpload'; // Import DocUpload component
import { FolderIcon, ArrowRightIcon, PlusIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

const Dashboard = () => {
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  // Function to fetch documents
  const fetchDocs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setUserId(decoded.user.id);
      }
      const res = await axios.get('http://localhost:5000/api/document/list', {
        headers: { 'x-auth-token': token }
      });
      setDocs(res.data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
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

      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          
          {/* Quick Stats / Welcome */}
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Hello, Citizen</h1>
            <p className="text-gray-600 mb-8">Securely manage your government-issued credentials.</p>
            
            {/* THE NEW REDIRECT BUTTON */}
            <button 
              onClick={() => navigate('/vault')}
              className="group flex items-center justify-between w-full max-w-sm p-4 bg-white border-2 border-dashed border-[#b15df6] rounded-2xl hover:bg-[#b15df6] hover:bg-opacity-5 transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-50 rounded-lg text-[#b15df6]">
                  <FolderIcon className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-800">Enter My Vault</p>
                  <p className="text-xs text-gray-500">View and manage all files</p>
                </div>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-[#b15df6] transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Upload Section */}
          <div className="w-full md:w-80">
            <DocUpload onUploadSuccess={fetchDocs} />
          </div>

        </div>
      </main>

      {/* Modal for Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/5 0 bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Upload New Document</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {userId && <DocUpload userId={userId} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;