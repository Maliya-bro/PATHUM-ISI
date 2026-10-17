const express = require('express');
const router = express.Router();
const { createQuestion, getAccountQuestions, getAllQuestionsAdmin, replyQuestion } = require('../controllers/questionController');
const { verifyGoogleUser, verifyAdmin } = require('../middleware/auth');

router.post('/', verifyGoogleUser, createQuestion);
router.get('/account/:accountId', getAccountQuestions);
router.get('/admin/all', verifyAdmin, getAllQuestionsAdmin);
router.patch('/admin/:id/reply', verifyAdmin, replyQuestion);

module.exports = router;