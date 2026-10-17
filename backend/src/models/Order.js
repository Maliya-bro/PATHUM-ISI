const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    paymentSlipUrl: { type: String, default: '' },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);