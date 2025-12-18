import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_strong_default_secret';

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');

    if(!token) {
        return res.status(401).json({msg: 'No token, authorization denied' });
    }

    try {
        const decode = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({msg: 'Token is not valid'});
    }
};

export default auth;