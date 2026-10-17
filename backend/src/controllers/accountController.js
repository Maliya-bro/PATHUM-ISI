const Account = require('../models/Account');
const imagekit = require('../config/imagekit');

exports.createAccount = async (req, res) => {
    try {
        const { title, description, price, discountPrice, isSpecialOwner, specialOwnerDetails } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'Upload at least 1 image' });
        }
        if (req.files.length > 13) {
            return res.status(400).json({ success: false, message: 'Maximum 13 images allowed' });
        }

        const uploadPromises = req.files.map((file) =>
            imagekit.upload({
                file: file.buffer,
                fileName: `ff_${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`,
                folder: '/ff_accounts',
            })
        );

        const uploaded = await Promise.all(uploadPromises);
        const images = uploaded.map((item) => ({ fileId: item.fileId, url: item.url }));

        const account = new Account({
            title,
            description,
            price: Number(price),
            discountPrice: Number(discountPrice) || 0,
            isSpecialOwner: isSpecialOwner === 'true' || isSpecialOwner === true,
            specialOwnerDetails: specialOwnerDetails || '',
            images,
        });

        await account.save();
        res.status(201).json({ success: true, account });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ status: { $ne: 'SOLD' } }).sort({ createdAt: -1 });
        res.json({ success: true, accounts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAccountById = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);
        if (!account) return res.status(404).json({ success: false, message: 'Account not found' });
        res.json({ success: true, account });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const account = await Account.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json({ success: true, account });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};