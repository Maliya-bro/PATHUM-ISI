const jwt = require('jsonwebtoken');

// ================= LOGIN =================
exports.loginAdmin = (req, res) => {
    const { passkey } = req.body;

    if (!passkey || passkey !== process.env.ADMIN_PASSKEY) {
        return res.status(401).json({ success: false, message: 'Invalid Master Passkey' });
    }

    const secretKey = process.env.JWT_SECRET || 'fallback_ultra_secure_jwt_token_key_2026';
    const token = jwt.sign({ role: 'admin' }, secretKey, { expiresIn: '3d' });

    res.cookie('admin_session', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    return res.json({ success: true, message: 'Authenticated successfully for 3 days' });
};

// ================= CHECK STATUS =================
exports.checkStatus = (req, res) => {
    try {
        const token = req.cookies?.admin_session;

        if (!token) {
            return res.json({ success: false, authorized: false });
        }

        const secretKey = process.env.JWT_SECRET || 'fallback_ultra_secure_jwt_token_key_2026';
        const decoded = jwt.verify(token, secretKey);

        if (decoded.role !== 'admin') {
            return res.json({ success: false, authorized: false });
        }

        return res.json({ success: true, authorized: true });
    } catch (err) {
        return res.json({ success: false, authorized: false });
    }
};

// ================= LOGOUT =================
exports.logoutAdmin = (req, res) => {
    res.clearCookie('admin_session', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });
    res.json({ success: true, message: 'Logged out successfully' });
};

// ================= MIDDLEWARE =================
exports.requireAdmin = (req, res, next) => {
    try {
        const token = req.cookies?.admin_session;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Admin login required' });
        }

        const secretKey = process.env.JWT_SECRET || 'fallback_ultra_secure_jwt_token_key_2026';
        const decoded = jwt.verify(token, secretKey);

        if (decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
    }
};
