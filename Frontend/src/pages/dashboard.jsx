import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import DocList from '../components/DocList'; // The file we created earlier
import DocUpload from '../components/DocUpload'; // Import DocUpload component
import { FolderIcon, ArrowRightIcon, PlusIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import { LuLayoutTemplate, LuView, LuUser } from "react-icons/lu";
import Dock from '../components/Dock';

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

      <main className="max-w-6xl mx-auto py-12 px-4 pt-20">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          
          {/* Quick Stats / Welcome */}
          <div className="flex-1 mt-14">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-2">Hello, Citizen</h1>
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

        <div className='w-full flex flex-col md:flex-row items-center gap-8 md:gap-24 my-16 md:my-32'>
          <div className='w-full md:w-[60%] text-center md:text-left py-8 md:py-24'>
            <h1 className='text-2xl md:text-3xl font-bold my-4 px-4 md:px-8'>Finding files made easy.
              {/* <div className="w-xl bg-indigo-600 block" style={{boxShadow: 'rgba(94, 35, 195, 1) -8px 10px 10px' }}>tada</div> */}
            </h1>
            <h1 className='text-lg md:text-xl font-light px-4 md:px-8'>
              Your files are stored and managed from hightech and secured Server. No worries for you here!
            </h1>
          </div>
          <div className='w-full md:w-[40%] flex justify-center'>
            <img src="/Server-rafiki.svg" alt="Server illustration" className="max-w-full h-auto" />
          </div>
        </div>
        <div className='w-full flex flex-col md:flex-row items-center gap-8 md:gap-16 my-16 md:my-32'>
          <div className='w-full md:w-[40%] flex justify-center order-2 md:order-1'>
            <img src="/No data-cuate.svg" alt="No data illustration" className="max-w-full h-auto" />
          </div>
          <div className='w-full md:w-[50%] text-center md:text-left py-8 md:py-24 order-1 md:order-2'>
            <h1 className='text-2xl md:text-3xl font-bold my-4 px-4 md:px-8'>Trouble! No more</h1>
            <h1 className='text-lg md:text-xl font-light px-4 md:px-8'>You for sure once was troubled to find that one document whole day.
              well now those days has been to an end -VaultGov
            </h1>
          </div>
        </div>
        <div className='w-full flex flex-col md:flex-row items-center gap-8 md:gap-24'>
          <div className='w-full md:w-[60%] text-center md:text-left py-8 md:py-24'>
            <h1 className='text-2xl md:text-3xl font-bold py-4 px-4 md:px-8'>Just One Click Away
            </h1>
              <h1 className='text-lg md:text-xl font-light px-4 md:px-8'>
                your job just glide your fingers...
                those days struggling to find your important documents are gone
              </h1>
          </div>
          <div className='w-full md:w-[40%] flex justify-center'>
            <img src="/Hard drive-rafiki.svg" alt="Hard drive illustration" className="max-w-full h-auto" />
          </div>
        </div>

        <Dock />
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