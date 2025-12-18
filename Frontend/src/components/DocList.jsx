import React, { useState } from 'react';
import axios from 'axios';
import { ShareIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const DocList = ({ doucments }) => {
    const [sharindDocId, setSharindDocId] = useState(null);
    const [shareUrl, setShareUrl] = useState('');
    const [message, setMessage] = useState('');

    const handleShare = async (docId) => {
        setSharingDocId(docId);
        setShareUrl('');
        setMessage('Generatin Secure Link');

        try {
            const res = await axios.post(`/api/documents/share/${docId}`);

            setShareUrl(res.data.shareUrl);
            setMessage(`Link Generate!, Expires by ${res.data.expiresIn}`)
        } catch (err) {
            setMessage('Error: Failed to genrate secure Link. Check Console.');
            console.error(err.response ? err.response.data : err.message);
        } finally {
            setSharingDocId(null);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen" >
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Your Digital Credentials</h2>

            {
                documents.map((doc) => (
                    <div key={doc._id} className="bg-white shadow-lg rounded-xl p-5 mb-4 border border-gray-100 flex justify-between items-center hover:shadow-xl transition duration-300">

                        {/* Document Info */}
                        <div className="flex flex-col">
                            <p className="text-xl font-semibold text-indigo-700">{doc.docType}</p>
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                                <ClockIcon className="w-4 h-4 mr-1" />
                                Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Actions and Share UI */}
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => handleShare(doc._id)}
                                disabled={sharingDocId === doc._id}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition duration-150 ${sharingDocId === doc._id
                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 text-white shadow-md'
                                    }`}
                            >
                                {sharingDocId === doc._id ? (
                                    'Sharing...'
                                ) : (
                                    <>
                                        <ShareIcon className="w-5 h-5 mr-2" />
                                        Generate Share Link
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))
            }

            {/* Share Modal/Notification (Tailwind Modal) */}
            {
                shareUrl && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
                            <CheckCircleIcon className="w-10 h-10 text-green-500 mx-auto" />
                            <h3 className="text-lg font-medium text-gray-900 text-center mt-3">Secure Link Generated!</h3>
                            <p className="text-sm text-gray-600 mt-2 text-center">{message}</p>

                            <div className="mt-4 flex flex-col">
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-sm overflow-ellipsis"
                                />
                                <button
                                    onClick={() => { navigator.clipboard.writeText(shareUrl); alert('Link copied!'); }}
                                    className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg"
                                >
                                    Copy Link
                                </button>
                                <button
                                    onClick={() => setShareUrl('')}
                                    className="mt-2 text-sm text-gray-500 hover:text-gray-800"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default DocList;

