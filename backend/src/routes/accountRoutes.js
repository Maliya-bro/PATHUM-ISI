const express = require('express');
const router = express.Router();
const {
    createAccount,
    getAllAccounts,
    getAccountById,
    updateStatus,
    toggleSoldStatus,
    deleteAccount
} = require('../controllers/accountController');
const { verifyAdmin } = require('../middleware/auth');
const upload = require('../middleware/uploader');

// Public routes
router.get('/', getAllAccounts);
router.get('/:id', getAccountById);

// Protected Admin routes
router.post('/', verifyAdmin, upload.array('images', 13), createAccount);
router.patch('/:id/sold', verifyAdmin, toggleSoldStatus);
router.patch('/:id/status', verifyAdmin, updateStatus);
router.delete('/:id', verifyAdmin, deleteAccount);

module.exports = router;
