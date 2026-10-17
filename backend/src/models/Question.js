const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: '' },
    question: { type: String, required: true, trim: true },
    reply: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Question', QuestionSchema);