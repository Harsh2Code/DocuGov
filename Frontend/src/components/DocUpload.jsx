import React, { useState } from 'react';
import { supabase } from '../supabase';
import axios from 'axios';

const DocUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [type, setType] = useState('PAN Card');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `user_docs/${Date.now()}.${fileExt}`;

    try {
      // 1. Upload file to Supabase
      const { data, error } = await supabase.storage
        .from('VaultGov')
        .upload(filePath, file);

      if (error) throw error;

      // 2. Save reference to MongoDB Atlas
      let res;
      try {
        res = await axios.post('http://localhost:5000/api/document/add', {
          docType: type,
          storagePath: filePath,
          ownerName: "Self"
        }, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
      } catch (localErr) {
        console.log('Localhost backend not available, trying deployed backend...');
        res = await axios.post('https://docugov.onrender.com/api/document/add', {
          docType: type,
          storagePath: filePath,
          ownerName: "Self"
        }, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
      }

      alert("Upload Successful!");
      setFile(null); // Reset file input
      if (onUploadSuccess) onUploadSuccess(); // Refresh the grid

    } catch (err) {
      console.error(err);
      alert(err.message || "Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="p-6 bg-white rounded-2xl shadow-sm border border-indigo-100 mt-8"
      style={{
        boxShadow: "inset rgba(255, 255, 255, 1) 1px 3px 5px, 0 3px 5px #00000030"
      }}
    >
      <h3 className="text-lg font-bold mb-4 text-gray-800">New Upload</h3>

      <select
        onChange={(e) => setType(e.target.value)}
        className="w-full mb-3 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b15df6] outline-none"
      >
        <option>PAN Card</option>
        <option>Passport</option>
        <option>CBSE</option>
        <option>HBSE</option>
        <option>ICSE</option>
        <option>UHBVN</option>
        <option>Muncipal Corporation</option>
        <option>Voting</option>
        <option>Driving</option>
        <option>Kerala Govt</option>
        <option>Telengana Govt</option>
        <option>Maharashtra Govt</option>
        <option>Uttrakhand Govt</option>
      </select>

      <input
        type="file"
        accept=".pdf, .png, .jpg, .jpeg, .doc, .docx"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4 block w-full text-sm text-gray-500 
          file:mr-4 file:py-2 file:px-4 
          file:rounded-full file:border-0 
          file:bg-indigo-50 file:bg-opacity-10 
          file:text-indigo-700 file:font-semibold
          hover:file:bg-opacity-20 cursor-pointer"
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`w-full py-2 rounded-xl font-bold text-white transition-all ${uploading ? 'bg-gray-400' : 'bg-indigo-600 hover:shadow-md hover:bg-indigo-800'
          }`}
      >
        {uploading ? "Processing..." : "Confirm Upload"}
      </button>
    </div>
  );
}

export default DocUpload;