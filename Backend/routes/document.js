import express from 'express';
import Document from '../models/Document.js';
import auth from '../middleware/auth.js';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
   storage,
   fileFilter: (req, file , cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb (null, true);
    } else {
      cb(new Error("only images, PDF and Word docs are allowed"));
    }
   }
  });

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
    const { docType } = req.body;
    let existingDoc = await Document.findOne({
      userRef: req.user.id,
      docType: docType
    });

    if (existingDoc) { // Check for existing file and request of update
      if(fs.existsSync(existingDoc.storagePath)) {
        fs.unlinkSync(existingDoc.storagePath);
      }

      // update With new File
      existingDoc.storagePath = 'uploads/' + req.file.filename;
      existingDoc.uploadDate = Date.now();
      await existingDoc.save();
      return res.json({ msg: 'Document updated successfully', doc: existingDoc });
    }
      // CREATE LOGIC: If it doesn't exist, make a new one
      const newDoc = new Document ({
      userRef: req.user.id,
      docType,
      storagePath: 'uploads/' + req.file.filename
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
router.get('/share/:id', auth, async (req, res) => {
  try {
    const document = await Document.findById( req.params.id );
    if (!document) return res.status(404).json({ msg: 'Not found' });

    // url not visible. hardcoding url
    const fullUrl = `http://localhost:5000/${document.storagePath}`
    res.json({ shareUrl: fullUrl });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// 4. Delete Document
router.delete('/:id', auth, async (req,res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({msg: 'Document Not Found' });
    if (document.userRef.toString() !== req.user.id) return res.status(401).json({msg: 'Unauthorized'});

    // Deleting logic if Found
    if (fs.existsSync( document.storagePath )) {
      fs.unlinkSync( document.storagePath );
    }

    await document.deleteOne();
    res.json ({msg: 'Document Removed' });
  } catch (err) {
    res.status(500).send ('Server Error');
  }
})
export default router;
