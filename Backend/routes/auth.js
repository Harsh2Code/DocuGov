import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/sync', async (req, res) => {
    const {firebaseUID, name, email, aadhaarNumber } = req.body;

    try {
        let user = await User.findOne({ firebaseUID});
        if(!user) {
            user = new User({firebaseUID, name, email, aadhaarNumber });
            await user.save();
        }

        const payload = {user: {id: user.id }};
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d'}, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
})

// Add your auth routes here, e.g.,
// router.post('/login', ...);
// router.post('/register', ...);

export default router;
