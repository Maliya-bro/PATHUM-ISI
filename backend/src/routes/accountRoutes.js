const express = require('express');
const router = express.Router();
const { createAccount, getAllAccounts, getAccountById, updateStatus } = require('../controllers/accountController');
const { verifyAdmin } = require('../middleware/auth');
const upload = require('../middleware/uploader');

router.get('/', getAllAccounts);
router.get('/:id', getAccountById);
router.post('/', verifyAdmin, upload.array('images', 13), createAccount);
router.patch('/:id/status', verifyAdmin, updateStatus);

module.exports = router;