import React, {useState} from 'react';
import {storage} from '../firebaseConfig';
import {ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';

const DocUpload = ({ userId }) => {
    const [file, setFile] = useState(null);
    const [type, setType] = useState('PAN Card');

    const handleUpload = async () => {
        if (!file) return alert ("select a file first0");

        const storageRef = ref(storage, `credentials/${userId}/${type}/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        await axios.post('/api/document/add', {
            docType: type,
            storagePath: storageRef.fullPath,
            downloadURL: url
        },{ headers: {'x-auth-token': localStorage.getItem('token')}});

        alert("Upload Successful ✈️");
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md border border-indigo-100">
      <h3 className="text-lg font-bold mb-4 text-indigo-900">Upload Credential</h3>
      <select onChange={(e) => setType(e.target.value)} className="w-full mb-3 p-2 border rounded">
        <option>PAN Card</option>
        <option>Passport</option>
        <option>Mark Sheet</option>
      </select>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700" />
      <button onClick={handleUpload} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition">
        Confirm Upload
      </button>
    </div>
    )
}

export default DocUpload;
