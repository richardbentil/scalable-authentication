import { connectDB } from '../configs/db.js';
import crypto from 'crypto';

const hashRefreshToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

const saveRefreshToken = async ({ userId, token, expirationDate, ipAddress }) => {
    const db = await connectDB();
    const hashedToken = hashRefreshToken(token);

    await db.collection('refresh_tokens').insertOne({
        userId,
        token: hashedToken,
        expirationDate,
        createdAt: new Date(),
        ipAddress: ipAddress || null
    });

    return { hashedToken, expirationDate };
};

const findRefreshToken = async (refreshToken) => {
    const db = await connectDB();
    const hashedToken = hashRefreshToken(refreshToken);

    return db.collection('refresh_tokens').findOne({ token: hashedToken });
};

export { saveRefreshToken, findRefreshToken, hashRefreshToken };
