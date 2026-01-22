import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
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
    const allowedTypes = ['.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG, JPG, and JPEG images are allowed for profile pictures"));
    }
  }
});

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password, aadhaarNumber } = req.body;
    console.log('Register attempt for email:', email);

    try {
        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists for email:', email);
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            aadhaarNumber
        });

        await user.save();
        console.log('User registered successfully for email:', email);

        const jwtSecret = process.env.JWT_SECRET || 'myjwtsecret';
        const payload = { user: { id: user.id } };
        jwt.sign(payload, jwtSecret, { expiresIn: '7d' }, (err, token) => {
            if (err) {
                console.log('JWT sign error during registration:', err);
                throw err;
            }
            console.log('Registration successful for email:', email);
            res.json({ token });
        });
    } catch (err) {
        console.log('Registration error for email:', email, 'Error:', err);
        res.status(500).send('Server Error');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    try {
        let user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for email:', email);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const jwtSecret = process.env.JWT_SECRET || 'myjwtsecret';
        const payload = { user: { id: user.id } };
        jwt.sign(payload, jwtSecret, { expiresIn: '7d' }, (err, token) => {
            if (err) {
                console.log('JWT sign error:', err);
                throw err;
            }
            console.log('Login successful for email:', email);
            res.json({ token });
        });
    } catch (err) {
        console.log('Login error:', err);
        res.status(500).send('Server Error');
    }
});

router.put('/profile', [auth, upload.single('profilePicture')], async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (req.file) {
      const filePath = `profile_pictures/${Date.now()}-${req.file.originalname}`;

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from('VaultGov')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (error) throw error;

      // Delete old profile picture if exists
      if (user.profilePicture) {
        const { error: deleteError } = await supabase.storage.from('VaultGov').remove([user.profilePicture]);
        if (deleteError) console.error('Error deleting old profile picture:', deleteError);
      }

      user.profilePicture = filePath;
    }

    await user.save();
    res.json({ msg: 'Profile updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Generate signed URL for profile picture if exists
    let profilePictureUrl = null;
    if (user.profilePicture) {
      const { data, error } = await supabase.storage
        .from('VaultGov')
        .createSignedUrl(user.profilePicture, 3600); // 1 hour expiry
      if (!error) profilePictureUrl = data.signedUrl;
    }

    res.json({ ...user.toObject(), profilePictureUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;
