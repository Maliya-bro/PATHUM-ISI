const Question = require('../models/Question');

exports.createQuestion = async (req, res) => {
    try {
        const { accountId, question } = req.body;
        if (!accountId || !question) {
            return res.status(400).json({ success: false, message: 'Account ID and question required' });
        }

        const newQuestion = new Question({
            accountId,
            userEmail: req.user.email,
            userName: req.user.name,
            userAvatar: req.user.picture,
            question,
        });

        await newQuestion.save();
        res.status(201).json({ success: true, question: newQuestion });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAccountQuestions = async (req, res) => {
    try {
        const questions = await Question.find({ accountId: req.params.accountId }).sort({ createdAt: -1 });
        res.json({ success: true, questions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllQuestionsAdmin = async (req, res) => {
    try {
        const questions = await Question.find().populate('accountId', 'title price').sort({ createdAt: -1 });
        res.json({ success: true, questions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.replyQuestion = async (req, res) => {
    try {
        const { reply } = req.body;
        const question = await Question.findByIdAndUpdate(req.params.id, { reply }, { new: true });
        res.json({ success: true, question });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};