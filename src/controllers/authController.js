import { signup as signupService, login as loginService, refreshAccessToken as refreshAccessTokenService, getUserProfile as getUserProfileService } from '../services/authService.js';
import { setCookie } from '../configs/cookies.js';

// handle user registration and issue tokens
const register = async (req, res) => {
    try {
        // capture the client IP address from the request
        const user = await signupService({ ...req.body, ipAddress: req.ipAddress });
        setCookie(res, 'access_token', user.access_token);
        setCookie(res, 'refresh_token', user.refresh_token);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// handle user login and issue tokens
const login = async (req, res) => {
    try {
        // capture the client IP address from the request
        const user = await loginService({ ...req.body, ipAddress: req.ipAddress });
        setCookie(res, 'access_token', user.access_token);
        setCookie(res, 'refresh_token', user.refresh_token);
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

// issue a new access token when the refresh token is valid
const refreshToken = async (req, res) => {
    try {
        const refreshTokenValue = req.cookies?.refresh_token;
        if (!refreshTokenValue) {
            return res.status(401).json({ error: 'No refresh token provided' });
        }

        const result = await refreshAccessTokenService(refreshTokenValue);
        setCookie(res, 'access_token', result.access_token);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const profile = await getUserProfileService(req.user.id);
        res.status(200).json(profile);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export { register, login, getProfile, refreshToken };