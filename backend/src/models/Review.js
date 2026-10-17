const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    userAvatar: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', ReviewSchema);