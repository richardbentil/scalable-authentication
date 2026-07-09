import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { saveRefreshToken, findRefreshToken } from '../repositories/refreshTokenRepository.js';

// create a short-lived access token for authenticated requests
const setAccessToken = (userData) => {
    const payload = {
        email: userData.email,
        id: userData.id || userData._id,
        role: userData.role || 'user'
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || '15m'
    });
};

// create a long-lived refresh token and save it using the repository layer
const setRefreshToken = async (userData) => {
    const token = crypto.randomBytes(64).toString('hex');
    const expirationDate = new Date(
        Date.now() + Number(process.env.REFRESH_TOKEN_EXPIRATION || 7) * 24 * 60 * 60 * 1000
    );

    const savedToken = await saveRefreshToken({
        userId: userData.id || userData._id,
        token,
        expirationDate,
        ipAddress: userData.ipAddress || null
    });

    return {
        token,
        hashedToken: savedToken.hashedToken,
        expirationDate: savedToken.expirationDate
    };
};

// verify that a refresh token exists in the database and has not expired
const verifyRefreshToken = async (refreshToken) => {
    const existingToken = await findRefreshToken(refreshToken);

    if (!existingToken) {
        throw new Error('Invalid refresh token');
    }

    if (existingToken.expirationDate < new Date()) {
        throw new Error('Refresh token expired');
    }

    return existingToken;
};

export { setAccessToken, setRefreshToken, verifyRefreshToken };
