import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { supabase } from '../supabase';
import FileModal from '../components/FileModal';
import Navbar from '../components/Navbar';
import Dock from '../components/Dock';

const DocumentsPage = () => {
    const [docs, setDocs] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [fileUrls, setFileUrls] = useState({});

    const logos = {
        aadhar : {
            title: "Aadhar Card",
            path: "./aadharCardlogo.png",
        },
        CBSE : {
            title: "CBSE",
            path: "./cbseLogo.webp",
        },
        HBSE : {
            title: "HBSE",
            path: "./hbseLogo.jpg",
        },
        ICSE : {
            title: "ICSE",
            path: "./ICSELogo.jpg",
        },
        UHBVN : {
            title: "UHBVN",
            path: "./uhbvnLogo.png",
        },
        MuncipalCorpotation : {
            title: "Muncipal Corporation",
            path: "./muncipalLogo.jpg",
        },
        Voter : {
            title: "Election Commision of India",
            path: "./VoterLogo.jpg",
        },
        drivingLicense : {
            title: "License",
            path: "./drivingLicense.avif",
        },
        KeralaGovt : {
            title: "Kerala Government",
            path: "./klaGovt.png",
        },
        TelenganaGovt : {
            title: "Telangana Government",
            path: "./tngnaGovt.jpg",
        },
        MaharashtraGovt : {
            title: "Maharashtra Government",
            path: "mhGovt.png",
        },
        UttrakhandGovt : {
            title: "Uttrakhand Government",
            path: "./ukGovt.png",
        },
    }

    const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

    const fetchDocs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/document/list', {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setDocs(res.data);

            // Fetch signed URLs for all documents
            const urlsPromises = res.data.map(async doc => {
                try {
                    const { data, error } = await supabase.storage
                        .from('VaultGov')
                        .createSignedUrl(doc.storagePath, 3600); // 1 hour expiry
                    if (error) throw error;
                    return { id: doc._id, url: data.signedUrl };
                } catch (err) {
                    console.error('Error getting signed URL for', doc._id, err);
                    return { id: doc._id, url: null };
                }
            });
            const urls = await Promise.all(urlsPromises);
            setFileUrls(Object.fromEntries(urls.map(u => [u.id, u.url])));
        } catch (err) { console.error("Error fetching docs", err); }
    }

    useEffect(() => { fetchDocs(); }, []);

    // Helper to determine if file is an image
    const isImage = (path) => /\.(jpg|jpeg|png|webp|gif)$/i.test(path);
    const isPDF = (path) => /\.pdf$/i.test(path);

    return (
        <div className="min-h-screen min-w-screen bg-gray-100">
            <div className="text-xl !w-screen font-bold mb-8 fixed absolute top-0">
                {/* <span className="text-[#b15df6]">🧘</span> My Secure Vault */}
                <Navbar />
            </div>

            <div className='w-screen h-24'>      {/* toggle section */}
                <div className="relative w-screen h-24 border-2 border-blue-200 flex items-center gap-8 mt-16">
                    {Object.values(logos).map(logo => (
                        <span key={logo.title} className='w-22 h-22 bg-white rounded-full shadow-lg overflow-hidden'>
                            <img src={logo.path} className='h-18 w-18 my-2 mx-auto' alt={logo.title} />
                        </span>
                    ))}
                </div>

            </div>
            <div className="max-w-6xl mx-auto p-8" >

                <div className="grid grid-cols-1 sm:grid-cols-2 mt-24 lg:grid-cols-4 gap-6">
                    {docs.map(doc => {
                        const fileUrl = fileUrls[doc._id];
                        
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
                <Dock />
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