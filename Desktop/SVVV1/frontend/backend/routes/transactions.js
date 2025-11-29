import express from 'express';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import BlockchainLedger from '../models/BlockchainLedger.js';
import { protect } from '../middleware/auth.js';
import { generateHash } from '../utils/helpers.js';

const router = express.Router();

// @route   GET /api/transactions
// @desc    Get user's transactions
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id })
            .sort({ timestamp: -1 });

        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching transactions' });
    }
});

// @route   POST /api/transactions/receive
// @desc    Add income/receive transaction
// @access  Private
router.post('/receive', protect, async (req, res) => {
    try {
        const { amount, description, category } = req.body;

        const user = await User.findById(req.user._id);

        // Create transaction
        const transaction = await Transaction.create({
            userId: user._id,
            type: 'receive',
            amount,
            description,
            category,
            timestamp: new Date()
        });

        // Update user balance
        user.balance += parseFloat(amount);
        await user.save();

        // Log to blockchain
        const lastBlock = await BlockchainLedger.findOne().sort({ blockNumber: -1 });
        const blockNumber = lastBlock ? lastBlock.blockNumber + 1 : 1;
        const previousHash = lastBlock ? lastBlock.hash : '0x0000000000000000000000000000000000000000000000000000000000000000';

        const blockData = {
            blockNumber,
            timestamp: new Date(),
            transactionData: `RECEIVE: ${description} - ₹${amount}`,
            toUid: user.uid,
            amount
        };

        const hash = generateHash(blockData);

        const blockchainEntry = await BlockchainLedger.create({
            blockNumber,
            hash,
            previousHash,
            timestamp: new Date(),
            transactionData: `RECEIVE: ${description} - ₹${amount}`,
            toUid: user.uid,
            amount
        });

        // Update transaction with blockchain hash
        transaction.blockchainHash = hash;
        await transaction.save();

        res.status(201).json({
            transaction,
            newBalance: user.balance,
            blockchainHash: hash
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating transaction' });
    }
});

// @route   POST /api/transactions/send
// @desc    Send money to another UID
// @access  Private
router.post('/send', protect, async (req, res) => {
    try {
        const { recipientUid, amount, description, category, securityPin } = req.body;

        const sender = await User.findById(req.user._id);

        // Verify security PIN
        const isPinValid = await sender.comparePin(securityPin);
        if (!isPinValid) {
            return res.status(401).json({ message: 'Invalid security PIN' });
        }

        // Check if recipient exists
        const recipient = await User.findOne({ uid: recipientUid });
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient UID not found. Please check and try again.' });
        }

        // Check if sender has sufficient balance
        if (sender.balance < parseFloat(amount)) {
            return res.status(400).json({
                message: `Insufficient funds. Your current balance is ₹${sender.balance.toFixed(2)}`
            });
        }

        // Create transaction for sender
        const senderTransaction = await Transaction.create({
            userId: sender._id,
            type: 'send',
            amount,
            description,
            category,
            recipientUid: recipient.uid,
            timestamp: new Date()
        });

        // Create transaction for recipient
        const recipientTransaction = await Transaction.create({
            userId: recipient._id,
            type: 'receive',
            amount,
            description: `Received from ${sender.uid}: ${description}`,
            category,
            senderUid: sender.uid,
            timestamp: new Date()
        });

        // Update balances
        sender.balance -= parseFloat(amount);
        recipient.balance += parseFloat(amount);

        await sender.save();
        await recipient.save();

        // Log to blockchain
        const lastBlock = await BlockchainLedger.findOne().sort({ blockNumber: -1 });
        const blockNumber = lastBlock ? lastBlock.blockNumber + 1 : 1;
        const previousHash = lastBlock ? lastBlock.hash : '0x0000000000000000000000000000000000000000000000000000000000000000';

        const blockData = {
            blockNumber,
            timestamp: new Date(),
            transactionData: `TRANSFER: ${sender.uid} → ${recipient.uid} - ₹${amount}`,
            fromUid: sender.uid,
            toUid: recipient.uid,
            amount
        };

        const hash = generateHash(blockData);

        await BlockchainLedger.create({
            blockNumber,
            hash,
            previousHash,
            timestamp: new Date(),
            transactionData: `TRANSFER: ${sender.uid} → ${recipient.uid}: ${description} - ₹${amount}`,
            fromUid: sender.uid,
            toUid: recipient.uid,
            amount
        });

        // Update transactions with blockchain hash
        senderTransaction.blockchainHash = hash;
        recipientTransaction.blockchainHash = hash;

        await senderTransaction.save();
        await recipientTransaction.save();

        res.status(201).json({
            message: 'Transaction successful',
            transaction: senderTransaction,
            newBalance: sender.balance,
            blockchainHash: hash
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error processing transaction' });
    }
});

// @route   GET /api/transactions/history
// @desc    Get transaction history for PDF export
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id })
            .sort({ timestamp: -1 });

        const user = await User.findById(req.user._id).select('-password -securityPin');

        res.json({
            user: {
                name: user.name,
                uid: user.uid,
                email: user.email
            },
            transactions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching history' });
    }
});

export default router;
