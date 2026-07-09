import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { connectDB } from '../configs/db.js';
import { setAccessToken, setRefreshToken, verifyRefreshToken } from '../configs/tokens.js';

// register a new user and issue both access and refresh tokens
const signup = async (userData) => {
    const db = await connectDB();
    const usersCollection = db.collection('users');

    // check whether the email already exists
    const existingUser = await usersCollection.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // hash the password and save the new user
    const passwordHash = await bcrypt.hash(userData.password, 10);
    const newUser = await usersCollection.insertOne({
        email: userData.email,
        role: userData.role || 'user',
        password: passwordHash
    });

    // create auth tokens for the new user
    const createdUser = { id: newUser.insertedId, email: userData.email, role: userData.role || 'user' };
    const accessToken = setAccessToken({ ...createdUser, role: userData.role || 'user', ipAddress: userData.ipAddress });
    const refreshTokenResult = await setRefreshToken({ ...createdUser, ipAddress: userData.ipAddress });

    return {
        id: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
        access_token: accessToken,
        refresh_token: refreshTokenResult.token
    };
};

// authenticate an existing user and issue both access and refresh tokens
const login = async (userData) => {
    const db = await connectDB();
    const usersCollection = db.collection('users');

    // find the user by email
    const existingUser = await usersCollection.findOne({ email: userData.email });
    if (!existingUser) {
        throw new Error('Invalid credentials');
    }

    // validate the password
    const isPasswordValid = await bcrypt.compare(userData.password, existingUser.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    // create access and refresh tokens for the authenticated user
    const accessToken = setAccessToken({
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role || 'user',
        ipAddress: userData.ipAddress
    });
    const refreshTokenResult = await setRefreshToken({
        id: existingUser._id,
        email: existingUser.email,
        ipAddress: userData.ipAddress
    });

    return {
        id: existingUser._id,
        email: existingUser.email,
        access_token: accessToken,
        refresh_token: refreshTokenResult.token
    };
};

// issue a new access token using a valid refresh token
const refreshAccessToken = async (refreshTokenValue) => {
    const tokenRecord = await verifyRefreshToken(refreshTokenValue);
    const db = await connectDB();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ _id: tokenRecord.userId });

    const newAccessToken = setAccessToken({
        id: user?._id || tokenRecord.userId,
        email: user?.email,
        role: user?.role || 'user'
    });

    return { access_token: newAccessToken };
};

// fetch the authenticated user's profile from the database
const getUserProfile = async (userId) => {
    const db = await connectDB();
    const usersCollection = db.collection('users');

    const query = {
        _id: typeof userId === 'string' && ObjectId.isValid(userId)
            ? new ObjectId(userId)
            : userId
    };

    const user = await usersCollection.findOne(query);
    if (!user) {
        throw new Error('User not found');
    }

    return {
        id: user._id,
        email: user.email,
        role: user.role || 'user'
    };
};

export { signup, login, refreshAccessToken, getUserProfile };