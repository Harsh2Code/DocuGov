import express from 'express';
import Document from '../models/Document.js';
import auth from '../middleware/auth.js';
import fs from 'fs';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

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

// add document 
router.post('/update', [auth, upload.single('file')], async (req,res) => {
  try {
    let existingDoc = await Document.findOne({
    usingRef: req.user.id,
    docType: docType,
    ownerName: ownerName,
  });

  if (existingDoc) { // Checkpost for existing file and request of update
    if(fs.existsSync(existingDoc.storagePath)) {
      fs.unlinkSync(existingDoc.storagePath);
    }

    // update With new File
    existingDoc.storagePath = req.file.path;
    existingDoc.uploadData = Date.now();
    await existingDoc.save();
    return res.json({ msg: 'Document update successfully', doc: existingDoc });
  }
    //3. CREATE lOGIC: If it doesn't exist, make a new one
    const newDoc = new Document ({
    userRef: req.user.id,
    ownerName,
    docType,
    storagePath: req.file.path
  });

  await newDoc.save();
  res.json({ msg: 'New document added', doc: newDoc });
  } catch (err) {
    res.status(500).send('Server Error during upload');
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

// 3. SHARE (Placeholder since Firebase removed)
router.post('/share/:docId', auth, async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.docId, userRef: req.user.id });
    if (!document) return res.status(404).json({ msg: 'Not found' });

    // Placeholder share URL since Firebase storage is removed
    res.json({ shareUrl: `http://localhost:5000/api/documents/view/${document._id}`, expiresIn: 'Not applicable' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

export default router;
