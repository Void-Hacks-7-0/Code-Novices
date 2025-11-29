import express from 'express';
import BlockchainLedger from '../models/BlockchainLedger.js';

const router = express.Router();

// @route   GET /api/blockchain/ledger
// @desc    Get public blockchain ledger (all transactions)
// @access  Public
router.get('/ledger', async (req, res) => {
    try {
        const ledger = await BlockchainLedger.find()
            .sort({ blockNumber: -1 })
            .limit(100); // Limit to last 100 blocks for performance

        res.json(ledger);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching blockchain ledger' });
    }
});

// @route   GET /api/blockchain/ledger/all
// @desc    Get complete blockchain ledger
// @access  Public
router.get('/ledger/all', async (req, res) => {
    try {
        const ledger = await BlockchainLedger.find()
            .sort({ blockNumber: 1 }); // Ascending order for complete chain

        res.json(ledger);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching blockchain ledger' });
    }
});

// @route   GET /api/blockchain/block/:blockNumber
// @desc    Get specific block by number
// @access  Public
router.get('/block/:blockNumber', async (req, res) => {
    try {
        const block = await BlockchainLedger.findOne({
            blockNumber: parseInt(req.params.blockNumber)
        });

        if (!block) {
            return res.status(404).json({ message: 'Block not found' });
        }

        res.json(block);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching block' });
    }
});

export default router;
