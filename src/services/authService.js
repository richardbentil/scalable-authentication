import bcrypt from 'bcrypt';
import { connectDB } from '../config/db.js';

const signup = async (userData) => {
    let db = await connectDB();
    const usersCollection = db.collection('users');
    // 1. check if user exists in the database
    const existingUser = await usersCollection.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // 2. create new user account
        // 1. hash password
        const passwordHash = await bcrypt.hash(userData.password, 10);
        // 2. save user to database
        const newUser = await usersCollection.insertOne({
            email: userData.email,
            password: passwordHash
        });

    // 3. set jwt token
        const accessToken = setAccessToken({...newUser, ipAddress: userData.ipAddress});
        const refreshToken = setRefreshToken({...newUser, ipAddress: userData.ipAddress});

    // 4. set cookies 
        setCookie(res, 'access_token', accessToken);
        setCookie(res, 'refresh_token', refreshToken);

    // 5. return user data
    return {
        id: newUser.insertedId,
        email: newUser.email,
        access_token: accessToken,
        refresh_token: refreshToken
    };
};

const login = async (userData) => {
    let db = await connectDB();
    const usersCollection = db.collection('users');
    // 1. check if user exists in the database
    const existingUser = await usersCollection.findOne({ email: userData.email });
    if (!existingUser) {
        throw new Error('Invalid credentials');
    }
    // 2. validate password
    const isPasswordValid = await bcrypt.compare(userData.password, existingUser.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }
    // 3. set jwt token
    
    const accessToken = setAccessToken({...existingUser, ipAddress: userData.ipAddress});
    const refreshToken = setRefreshToken({...existingUser, ipAddress: userData.ipAddress});

    // 4. set cookies 
    setCookie(res, 'access_token', accessToken);
    setCookie(res, 'refresh_token', refreshToken);

    // 5. return user data
    return {
        id: existingUser._id,
        email: existingUser.email,
        access_token: accessToken,
        refresh_token: refreshToken
    };
};

export { signup, login };