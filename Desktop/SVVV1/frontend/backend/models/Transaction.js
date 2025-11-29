import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['receive', 'send'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    recipientUid: {
        type: String,
        default: null
    },
    senderUid: {
        type: String,
        default: null
    },
    blockchainHash: {
        type: String,
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
transactionSchema.index({ userId: 1, timestamp: -1 });
transactionSchema.index({ recipientUid: 1 });
transactionSchema.index({ senderUid: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
