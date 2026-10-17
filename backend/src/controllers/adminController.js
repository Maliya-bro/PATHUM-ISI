const jwt = require('jsonwebtoken');

// ================= LOGIN =================
exports.loginAdmin = (req, res) => {
    const { passkey } = req.body;

    if (!passkey || passkey !== process.env.ADMIN_PASSKEY) {
        return res.status(401).json({ success: false, message: 'Invalid Master Passkey' });
    }

    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '3d' });

    res.cookie('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    return res.json({ success: true, message: 'Authenticated successfully for 3 days' });
};

// ================= CHECK STATUS (FIXED) =================
exports.checkStatus = (req, res) => {
    try {
        const token = req.cookies?.admin_session;

        if (!token) {
            return res.json({ success: false, authorized: false });
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'admin') {
            return res.json({ success: false, authorized: false });
        }

        return res.json({ success: true, authorized: true });
    } catch (err) {
        // Invalid / expired token
        return res.json({ success: false, authorized: false });
    }
};

// ================= LOGOUT =================
exports.logoutAdmin = (req, res) => {
    res.clearCookie('admin_session', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    res.json({ success: true, message: 'Logged out successfully' });
};

// ================= MIDDLEWARE (NEW — for protected routes) =================
exports.requireAdmin = (req, res, next) => {
    try {
        const token = req.cookies?.admin_session;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Admin login required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
    }
};
