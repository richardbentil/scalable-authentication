// jwt access token
const setAccessToken = (userData) => {
    // 1. create jwt token
    const token = jwt.sign({ email: userData.email, id: userData.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // 2. return jwt token
    return token;
}

 // jwt refresh token
const setRefreshToken = (userData) => {
    // 1. create jwt token
    const token = jwt.sign({ email: userData.email, id: userData.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d', ipAddress: userData.ipAddress, revoked: false });
    // 2. return jwt token
    return token;
}   