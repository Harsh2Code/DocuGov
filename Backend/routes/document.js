import express from 'express';
import Document from '../models/Document.js';
import auth from '../middleware/auth.js';
import { generateSignedUrl } from '../config/firebase.js';

const router = express.Router();

// 1. SAVE metadata after frontend upload
router.post('/add', auth, async (req, res) => {
  try {
    const newDoc = new Document({
      userRef: req.user.id,
      docType: req.body.docType,
      storagePath: req.body.storagePath
    });
    const doc = await newDoc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// 2. GET all documents for the logged-in user
router.get('/list', auth, async (req, res) => {
  try {
    const docs = await Document.find({ userRef: req.user.id }).sort({ uploadDate: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// 3. SHARE (The logic we wrote earlier)
router.post('/share/:docId', auth, async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.docId, userRef: req.user.id });
    if (!document) return res.status(404).json({ msg: 'Not found' });

    const signedUrl = await generateSignedUrl(document.storagePath, 60);
    res.json({ shareUrl: signedUrl, expiresIn: '60 minutes' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

export default router;