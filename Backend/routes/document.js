import express from 'express';
import { generateSignedUrl } from '../config/firebase.js' 
import Document from '../models/Document.js';
import ShareLog from '../models/ShareLog.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/share/:docId', auth, async (req,res) => {
    const {docId} = req.params;
    const userId = req.user.id;
    
    try {
        const document  = await Document.findOne({_id: docId, userRef: userId });
        if( !document ) {
            return res.status(404).json({msg: 'Document not found or access denied' });
        }

    const EXPIRATION_MINUTES = 60;

    const signedUrl = await generateSignedUrl(document.storagePath, EXPIRATION_MINUTES);

    // create a ShareLog entry
    const newLog = new ShareLog({
        documentId: document._id,
        sharerUID: userId,
        signedUrl: signedUrl,
        expirationTime: new Date(Date.now() + EXPIRATION_MINUTES * 60 * 1000),
        accessCount: 0,
        maxAccess: 1,
    });
    await newLog.save();

    res.json ({
        msg: 'Share link Successfully generated.',
        shareUrl: signedUrl,
        expiresIn: `${EXPIRATION_MINUTES} minutes`
    })
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
}
})

export default router;
