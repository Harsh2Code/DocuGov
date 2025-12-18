import React, { useState, useEffect } from 'react';
import DocList from '../components/DocList'; // The file we created earlier
import { PlusIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

const Dashboard = () => {
  const [docs, setDocs] = useState([]);

  // In a real app, you'd fetch this from your Express API
  useEffect(() => {
    // Example data structure
    setDocs([
      { _id: '1', docType: 'PAN Card', uploadDate: new Date(), storagePath: 'users/123/pan.jpg' },
      { _id: '2', docType: 'Passport', uploadDate: new Date(), storagePath: 'users/123/pass.jpg' }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">GovVault</span>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Welcome back, Citizen</h1>
            <p className="text-gray-600">Manage your secure government credentials.</p>
          </div>
          <button className="flex items-center bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-green-700 transition">
            <PlusIcon className="h-5 w-5 mr-2" />
            Upload New Document
          </button>
        </div>

        {/* The List Component we built */}
        <div className="bg-white rounded-2xl shadow-sm border p-4">
          <DocList documents={docs} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;