import express from 'express';
import Document from '../models/Document.js';
import auth from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
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

    const filePath = `user_docs/${Date.now()}-${req.file.originalname}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('VaultGov')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) throw error;

    if (existingDoc) { // Check for existing file and request of update
      // Delete old file from Supabase
      const { error: deleteError } = await supabase.storage.from('VaultGov').remove([existingDoc.storagePath]);
      if (deleteError) console.error('Error deleting old file:', deleteError);

      // update With new File
      existingDoc.storagePath = filePath;
      existingDoc.uploadDate = Date.now();
      await existingDoc.save();
      return res.json({ msg: 'Document updated successfully', doc: existingDoc });
    }
      // CREATE LOGIC: If it doesn't exist, make a new one
      const newDoc = new Document ({
      userRef: req.user.id,
      docType,
      storagePath: filePath
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

// 3. SHARE (Generate share URL)
router.get('/share/:id', auth, async (req, res) => {
  try {
    const document = await Document.findById( req.params.id );
    if (!document) return res.status(404).json({ msg: 'Not found' });

    // Generate share URL to the frontend page
    const shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/shared/${req.params.id}`;
    res.json({ shareUrl });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// 3.5 PUBLIC ACCESS to shared document (no auth required)
router.get('/public/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ msg: 'Not found' });

    // Generate signed URL for public access (works for private buckets)
    const { data, error } = await supabase.storage.from('VaultGov').createSignedUrl(document.storagePath, 86400); // 24 hours expiry
    if (error) throw error;
    res.redirect(data.signedUrl);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// 3.6 GET SHARED DOCUMENT DATA (no auth required)
router.get('/get-shared/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ msg: 'Document not found' });

    // Generate signed URL
    const { data, error } = await supabase.storage.from('VaultGov').createSignedUrl(document.storagePath, 86400); // 24 hours expiry
    if (error) throw error;

    res.json({
      signedUrl: data.signedUrl,
      docType: document.docType,
      uploadDate: document.uploadDate
    });
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

    // Delete from Supabase storage
    const { error } = await supabase.storage.from('VaultGov').remove([document.storagePath]);
    if (error) {
      console.error('Error deleting from Supabase:', error);
      // Continue with DB deletion even if storage deletion fails
    }

    await document.deleteOne();
    res.json ({msg: 'Document Removed' });
  } catch (err) {
    res.status(500).send ('Server Error');
  }
})
export default router;
