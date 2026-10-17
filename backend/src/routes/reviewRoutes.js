const express = require('express');
const router = express.Router();
const { getReviews, createReview } = require('../controllers/reviewController');
const { verifyGoogleUser } = require('../middleware/auth');

router.get('/', getReviews);
router.post('/', verifyGoogleUser, createReview);

module.exports = router;