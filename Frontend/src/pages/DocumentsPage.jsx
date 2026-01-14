    import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { supabase } from '../supabase';
import FileModal from '../components/FileModal';
import Navbar from '../components/Navbar';
import Dock from '../components/Dock';

const DocumentsPage = () => {
    const [docs, setDocs] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [fileUrls, setFileUrls] = useState({})
    const [selectedLogo, setSelectedLogo] = useState("Self");
    const logos = {
        aadhar: {
            title: "Aadhar Card",
            path: "./aadharCardlogo.png",
        },
        CBSE: {
            title: "CBSE",
            path: "./cbseLogo.webp",
        },
        HBSE: {
            title: "HBSE",
            path: "./hbseLogo.jpg",
        },
        ICSE: {
            title: "ICSE",
            path: "./ICSELogo.jpg",
        },
        UHBVN: {
            title: "UHBVN",
            path: "./uhbvnLogo.png",
        },
        MuncipalCorpotation: {
            title: "Muncipal Corporation",
            path: "./muncipalLogo.jpg",
        },
        Voter: {
            title: "Election Commision of India",
            path: "./VoterLogo.jpg",
        },
        drivingLicense: {
            title: "License",
            path: "./drivingLicense.avif",
        },
        KeralaGovt: {
            title: "Kerala Government",
            path: "./klaGovt.png",
        },
        TelenganaGovt: {
            title: "Telangana Government",
            path: "./tngnaGovt.jpg",
        },
        MaharashtraGovt: {
            title: "Maharashtra Government",
            path: "mhGovt.png",
        },
        UttrakhandGovt: {
            title: "Uttrakhand Government",
            path: "./ukGovt.png",
        },
        PunjabGovt: {
            title: "Punjab Government",
            path: "./pnbGovt.png",
        },
        Self: {
            title: "Self",
            path: "./self.png",
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
        <div className="min-h-screen w-full bg-gray-100 overflow-x-hidden">
            <div className="text-xl w-full font-bold mb-8 fixed top-0">
                {/* <span className="text-[#b15df6]">🧘</span> My Secure Vault */}
                <Navbar />
            </div>
            {/* <div className="drawer md:drawer-open drawer-end mt-16 fixed">
                <input id="my-drawer-5" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Page content here */}
            {/* <label htmlFor="my-drawer-5" className="drawer-button btn btn-primary">Open drawer</label>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-5" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-gray-200 min-h-full w-80 p-4">
                        {/* Sidebar content here */}
            {/* {Object.values(logos).map(logo => (
                        <span key={logo.title} className='w-22 h-22 bg-white rounded-full shadow-lg overflow-hidden'>
                            <img src={logo.path} className='h-18 w-18 my-2 mx-auto' alt={logo.title} />
                        </span>
                    ))}
                        <li><a>Sidebar Item 1</a></li>
                        <li><a>Sidebar Item 2</a></li>
                    </ul>
                </div>
            </div> */}

            <div className="drawer lg:drawer-open drawer-end overflow-hidden">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content overflow-x-hidden">

                    {/* Page content here */}
                    <div className="p-4 overflow-x-hidden">
                        <div className="grid grid-cols-1 sm:grid-cols-2 mt-24 lg:grid-cols-4 gap-6">
                            {docs.filter(doc => selectedLogo === "Self" || doc.docType === selectedLogo).map(doc => {
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
                </div>

                <div className="drawer-side relative overflow-hidden">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="flex md:h-[100vh] flex-row items-start bg-gray-50 is-drawer-close:w-24 is-drawer-open:w-64 overflow-y-auto">
                        {/* Sidebar content here */}
                        <ul className="menu w-full grow pb-12">
                            {/* List item */}
                            <li>
                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">
                                    {/* Home icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                                    <span className="is-drawer-close:hidden">Homepage</span>
                                </button>
                            </li>

                            {/* List item */}

                            <div className="grid grid-cols-1 is-drawer-open:grid-cols-2 gap-2 mb-4">
                                {Object.values(logos).map(logo => (
                                    <div key={logo.title} className='flex flex-col items-center cursor-pointer' onClick={() => setSelectedLogo(logo.title)}>
                                        <span className={`w-16 h-16 bg-white rounded-full shadow-lg overflow-hidden flex-shrink-0 ${selectedLogo === logo.title ? 'border-2 border-indigo-500' : ''}`}>
                                            <img src={logo.path} className='w-12 h-12 m-2 object-contain' alt={logo.title} />
                                        </span>
                                        <p className="w-16 font-medium text-center is-drawer-close:hidden">
                                            {logo.title}
                                        </p>
                                    </div>
                                ))}
                            </div>

                        </ul>
                    </div>
                    <div className="absolute bottom-0 bg-indigo-600 rounded overflow-hidden flex items-center mx-auto w-full">
                        <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn w-12 h-12 rounded overflow-hidden mx-auto btn-square btn-ghost">
                            {/* Sidebar toggle icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="10 10 16 16" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
                        </label>
                    </div>
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