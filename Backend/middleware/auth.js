import 'dotenv/config';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'myjwtsecret';
console.log('JWT_SECRET in auth middleware:', JWT_SECRET);

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    console.log('Auth middleware: token received:', token ? 'present' : 'missing');

    if(!token) {
        return res.status(401).json({msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        console.log('Auth middleware: decoded user:', req.user);
        next();
    } catch (err) {
        console.log('Auth middleware: token verification failed:', err.message);
        res.status(401).json({msg: 'Token is not valid'});
    }
};

export default auth;