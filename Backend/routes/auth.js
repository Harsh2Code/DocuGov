import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password, aadhaarNumber } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
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

        const jwtSecret = process.env.JWT_SECRET || 'myjwtsecret';
        const payload = { user: { id: user.id } };
        jwt.sign(payload, jwtSecret, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
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

        const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_here';
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
});fd

export default router;
