import jwt from 'jsonwebtoken';

const withAuth = (req, res, next) => {
    const token = req.cookies?.access_token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = decoded;
        next();
    });
};

const verifyToken = withAuth;

export { withAuth, verifyToken };