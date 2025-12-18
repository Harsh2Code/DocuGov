import admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('../serviceAccountKey.json');

const BUCKET_NAME = 'your-project-id.appspot.com';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: BUCKET_NAME
});

const bucket = admin.storage().bucket();

/**
* @param {string} filePath
* @param {number} expirationMinutes - URL validity Duration
*/

export const generateSignedUrl = async (filePath, expirationMinutes = 60) => {
    const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + expirationMinutes * 60 * 1000,
    };

    try {
        const [url] = await bucket.file(filePath).getSignedUrl(options);
        return url;
    } catch (error) {
        console.error('Error generating signed URL: ', error);
        throw new Error('Failed to create secure share link');
    }
};

