import express from 'express';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/leaderboard
// @desc    Get leaderboard of users you've paid
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);

        // Get all transactions where current user sent money
        const sentTransactions = await Transaction.find({
            userId: req.user._id,
            type: 'send'
        });

        // Get unique recipient UIDs
        const recipientUids = [...new Set(sentTransactions.map(t => t.recipientUid))];

        if (recipientUids.length === 0) {
            return res.json([]);
        }

        // Get recipient users
        const recipients = await User.find({ uid: { $in: recipientUids } })
            .select('-password -securityPin');

        // Calculate stats for each recipient
        const leaderboardData = await Promise.all(recipients.map(async (recipient) => {
            // Get all transactions for this recipient
            const allTransactions = await Transaction.find({ userId: recipient._id });

            const totalReceived = allTransactions
                .filter(t => t.type === 'receive')
                .reduce((sum, t) => sum + t.amount, 0);

            const totalSent = allTransactions
                .filter(t => t.type === 'send')
                .reduce((sum, t) => sum + t.amount, 0);

            const savings = totalReceived - totalSent;

            // Get amount you sent to this user
            const amountSentToUser = sentTransactions
                .filter(t => t.recipientUid === recipient.uid)
                .reduce((sum, t) => sum + t.amount, 0);

            return {
                uid: recipient.uid,
                name: recipient.name,
                avatar: recipient.avatar,
                totalReceived,
                totalSent,
                savings,
                balance: recipient.balance,
                amountSentToUser
            };
        }));

        // Sort by savings (highest to lowest)
        leaderboardData.sort((a, b) => b.savings - a.savings);

        // Add rank
        const rankedData = leaderboardData.map((user, index) => ({
            ...user,
            rank: index + 1
        }));

        res.json(rankedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching leaderboard' });
    }
});

export default router;
