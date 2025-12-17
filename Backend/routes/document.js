import express from 'express';
import { generateSignedUrl } from '../config/firebase.js' 
import Document from '../models/Document.js';
import ShareLog from '..models/ShareLog.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/share/:docId', auth, async (req,res) => {
    const {docId} = req.params;
    const userId = req.user.id;
    
    try {
        const document  = await Document.findOne({_id: docId, userRef: userId })
        if( !document ) {
            return res.status(404).json({msg: 'Document not found or access denied' });
        }
    }
}
)