import jwt from 'jsonwebtoken';
import { runWithRequestContext } from '../utils/requestContext.js';

const withAuth = (requiredRole = null) => {
    return (req, res, next) => {
        const token = req.cookies?.access_token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            if (requiredRole && decoded.role !== requiredRole) {
                return res.status(403).json({ error: 'Forbidden: Insufficient role' });
            }

            req.user = decoded;

            runWithRequestContext({ user: decoded }, () => {
                next();
            });
        });
    };
};

const verifyToken = (req, res, next) => withAuth()(req, res, next);

export { withAuth, verifyToken };