
const setCookie = (res, name, value, options = {}) => {
    const defaultOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };
    res.cookie(name, value, { ...defaultOptions, ...options });
};