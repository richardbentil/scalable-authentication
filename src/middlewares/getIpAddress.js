const getIpAddress = (req, res, next) => {
    req.ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    next();
};

export default getIpAddress;
