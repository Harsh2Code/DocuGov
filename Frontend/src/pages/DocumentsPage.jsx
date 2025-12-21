import React, { useState, useEffect } from 'react'
import axios from 'axios';
import FileModal from '../components/FileModal';

const DocumentsPage = () => {
    const [docs, setDocs] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);

    const fetchDocs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/document/list', {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setDocs(res.data);
        } catch (err) { console.error("Error fetching docs", err); }
    }

    useEffect(() => { fetchDocs(); }, []);

    // Helper to determine if file is an image
    const isImage = (path) => /\.(jpg|jpeg|png|webp|gif)$/i.test(path);
    const isPDF = (path) => /\.pdf$/i.test(path);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                    <span className="text-[#b15df6]">🧘</span> My Secure Vault
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {docs.map(doc => {
                        const fileUrl = `http://localhost:5000/${doc.storagePath}`;
                        
                        return (
                            <div 
                                key={doc._id} 
                                onClick={() => setSelectedDoc(doc)}
                                className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#b15df6] transition-all shadow-sm hover:shadow-md"
                            >
                                {/* PREVIEW SECTION */}
                                <div className="h-40 bg-gray-100 overflow-hidden flex items-center justify-center">
                                    {isImage(doc.storagePath) ? (
                                        <img 
                                            src={fileUrl} 
                                            alt={doc.docType} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                    ) : isPDF(doc.storagePath) ? (
                                        <iframe 
                                            src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                                            className="w-full h-full pointer-events-none"
                                            title="PDF Preview"
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <span className="text-3xl">📄</span>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">
                                                {doc.storagePath.split('.').pop()}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 border-t">
                                    <h3 className="font-bold text-gray-800 truncate">{doc.docType}</h3>
                                    <p className="text-[10px] text-gray-500">
                                        {new Date(doc.uploadDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedDoc && (
                <FileModal 
                    doc={selectedDoc} 
                    onClose={() => setSelectedDoc(null)} 
                    refresh={fetchDocs} 
                />
            )}
        </div>
    )
}

export default DocumentsPage;