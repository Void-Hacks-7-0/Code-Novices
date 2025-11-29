import mongoose from 'mongoose';

const blockchainLedgerSchema = new mongoose.Schema({
    blockNumber: {
        type: Number,
        required: true,
        unique: true
    },
    hash: {
        type: String,
        required: true,
        unique: true
    },
    previousHash: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    transactionData: {
        type: String,
        required: true
    },
    fromUid: {
        type: String,
        default: null
    },
    toUid: {
        type: String,
        default: null
    },
    amount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Index for faster queries
blockchainLedgerSchema.index({ blockNumber: 1 });
blockchainLedgerSchema.index({ hash: 1 });

const BlockchainLedger = mongoose.model('BlockchainLedger', blockchainLedgerSchema);

export default BlockchainLedger;
