import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { supabase } from '../supabase';

const FileModal = ({ doc, onClose, refresh }) => {
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    const fetchSignedUrl = async () => {
      try {
        const { data, error } = await supabase.storage
          .from('VaultGov')
          .createSignedUrl(doc.storagePath, 3600); // 1 hour expiry
        if (error) throw error;
        setFileUrl(data.signedUrl);
      } catch (err) {
        console.error('Error getting signed URL', err);
      }
    };
    fetchSignedUrl();
  }, [doc.storagePath]);

  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(doc.storagePath);
  const isPDF = /\.pdf$/i.test(doc.storagePath);

  const handleDelete = async () => {
    if (!window.confirm("Delete permanently?")) return;

    try {
      // Log this to compare with what you see in Supabase Dashboard
      console.log("Deleting Path:", doc.storagePath);

      const { data, error } = await supabase.storage
        .from('VaultGov')
        .remove([doc.storagePath]);

      if (error) throw error;

      // If data is empty, the file wasn't found at that path
      if (data.length === 0) {
        console.warn("File not found in Supabase, but cleaning up MongoDB anyway.");
      }

      let deleteRes;
      try {
        deleteRes = await axios.delete(`http://localhost:5000/api/document/${doc._id}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
      } catch (localErr) {
        console.log('Localhost backend not available, trying deployed backend...');
        deleteRes = await axios.delete(`https://docugov.onrender.com/api/document/${doc._id}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
      }

      alert("Deleted successfully");
      refresh();
      onClose();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Share Logic
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/shared/${doc._id}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Share link copied to clipboard");
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      style={{
        boxShadow: "inset rgba(255, 255, 255, 1) 1px 3px 5px, 0 3px 5px #00000030"
      }}>
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl" >

        {/* HEADER */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{doc.docType}</h2>
          <button onClick={onClose} className="text-2xl text-gray-500">&times;</button>
        </div>

        {/* SMART PREVIEW AREA */}
        <div className="flex-1 bg-gray-200 overflow-auto flex justify-center items-center">
          {isImage ? (
            <img src={fileUrl} className="max-w-full max-h-full object-contain" alt="Preview" />
          ) : isPDF ? (
            <iframe src={fileUrl} className="w-full h-full" title="PDF Preview"></iframe>
          ) : (
            <div className="text-center p-10">
              <span className="text-6xl text-gray-400">📄</span>
              <p className="mt-4 text-gray-600 font-medium text-lg">Word Document Detected</p>
              <a href={fileUrl} download className="mt-4 inline-block bg-[#b15df6] text-white px-6 py-2 rounded-full font-bold">
                Download to View
              </a>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 bg-white border-t flex justify-around">
          <button onClick={() => window.open(fileUrl, '_blank')} className="flex items-center gap-2 text-indigo-600 font-bold">
            <span>👁️</span> Full Screen
          </button>
          <button onClick={handleShare} className="flex items-center gap-2 text-green-600 font-bold">
            <span>🔗</span> Share
          </button>
          <button onClick={handleDelete} className="text-red-500 font-bold">
            <span>🗑️</span> Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default FileModal