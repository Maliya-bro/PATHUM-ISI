const jwt = require('jsonwebtoken');

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
        maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: 'Authenticated successfully for 3 days' });
};

exports.checkStatus = (req, res) => {
    res.json({ success: true, authorized: true });
};

exports.logoutAdmin = (req, res) => {
    res.clearCookie('admin_session', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    res.json({ success: true, message: 'Logged out successfully' });
};