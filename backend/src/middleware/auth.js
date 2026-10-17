const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyAdmin = (req, res, next) => {
    const token = req.cookies.admin_session;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Admin authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Session expired. Enter passkey again.' });
    }
};

const verifyGoogleUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Google authentication required' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        req.user = {
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
        };
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid Google authentication token' });
    }
};

module.exports = { verifyAdmin, verifyGoogleUser };