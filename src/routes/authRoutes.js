import express from 'express';
import { login, register, getProfile, refreshToken } from '../controllers/authController.js';
import getIpAddress from '../middlewares/getIpAddress.js';
import { withAuth } from '../middlewares/withAuth.js';

const router = express.Router();

router.post('/register', getIpAddress, register);
router.post('/login', getIpAddress, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', (req, res) => {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.status(200).json({ message: 'Logged out successfully' });
});
router.get('/me', withAuth, getProfile);

export default router;