import React from 'react'
import axios from 'axios';

const FileModal = ({ doc, onClose, refresh }) => {
  const fileUrl = `http://localhost:5000/${doc.storagePath}`;
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(doc.storagePath);
  const isPDF = /\.pdf$/i.test(doc.storagePath);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this document? ")) return;
    await axios.delete(`http://localhost:5000/api/document/${doc._id}`, {
      headers: { 'x-auth-token': localStorage.getItem('token') }
    });
    refresh();
    onClose();
  };

  // Share Logic
  const handleShare = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/document/share/${doc._id}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });

      // copy link to clipboard
      navigator.clipboard.writeText(res.data.shareUrl);
      alert("Share link copied to clipboard");
    } catch (err) {
      alert(" Could not generate share link ");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
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
          <button onClick={handleDelete} className="text-red-500 font-bold">
            <span>🗑️</span> Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default FileModal