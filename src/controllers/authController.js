import { signup as signupService, login as loginService } from '../services/authService.js';

const register = async (req, res) => {
    try {
        const user = await signup(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const user = await loginService(req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

export { register, login };