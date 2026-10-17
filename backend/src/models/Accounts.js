const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    isSpecialOwner: { type: Boolean, default: false },
    specialOwnerDetails: { type: String, default: '' },
    images: [
        {
            fileId: { type: String, required: true },
            url: { type: String, required: true },
        }
    ],
    status: { type: String, enum: ['AVAILABLE', 'SOLD', 'RESERVED'], default: 'AVAILABLE' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Account', AccountSchema);