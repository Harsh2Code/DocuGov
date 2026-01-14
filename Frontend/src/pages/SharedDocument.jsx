import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SharedDocument = () => {
  const { id } = useParams();
  const [docData, setDocData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedDoc = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/document/get-shared/${id}`);
        setDocData(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedDoc();
  }, [id]);

  // Helper to determine if file is an image
  const getFileExtension = (url) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split('/').pop();
      return filename.split('.').pop().toLowerCase();
    } catch {
      return '';
    }
  };

  const isImage = (url) => ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(getFileExtension(url));
  const isPDF = (url) => getFileExtension(url) === 'pdf';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Document Not Found</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{docData.docType}</h1>
              <p className="text-sm text-gray-500">
                Uploaded on {new Date(docData.uploadDate).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={async () => {
                try {
                  const response = await fetch(docData.signedUrl);
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = docData.docType || 'document';
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                } catch (error) {
                  console.error('Download failed:', error);
                  // Fallback to opening in new tab
                  window.open(docData.signedUrl, '_blank');
                }
              }}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Document Display */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {isImage(docData.signedUrl) ? (
            <div className="p-4">
              <img
                src={docData.signedUrl}
                alt={docData.docType}
                className="w-full h-auto max-h-screen object-contain"
              />
            </div>
          ) : isPDF(docData.signedUrl) ? (
            <div className="h-screen">
              <iframe
                src={`${docData.signedUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                className="w-full h-full"
                title="Shared Document"
              />
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Document Preview Not Available</h3>
              <p className="text-gray-600 mb-4">
                This file type cannot be previewed in the browser. Please use the download button above.
              </p>
              <p className="text-sm text-gray-500">
                File type: {docData.signedUrl.split('.').pop().toUpperCase()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedDocument;
