const Review = require('../models/Review');

exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = new Review({
            userName: req.user.name,
            userAvatar: req.user.picture,
            rating: Number(rating),
            comment,
        });
        await review.save();
        res.status(201).json({ success: true, review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};