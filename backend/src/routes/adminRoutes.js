const express = require('express');
const router = express.Router();
const { loginAdmin, checkStatus, logoutAdmin } = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/auth');

router.post('/login', loginAdmin);
router.get('/status', verifyAdmin, checkStatus);
router.post('/logout', logoutAdmin);

module.exports = router;