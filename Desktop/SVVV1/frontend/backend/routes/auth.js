import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { generateUID } from '../utils/helpers.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, securityPin } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Generate unique UID
        let uid = generateUID(name);
        let uidExists = await User.findOne({ uid });

        // If UID exists, regenerate until unique
        while (uidExists) {
            uid = generateUID(name);
            uidExists = await User.findOne({ uid });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            uid,
            securityPin,
            balance: 5000
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                uid: user.uid,
                balance: user.balance,
                avatar: user.avatar,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            uid: user.uid,
            balance: user.balance,
            avatar: user.avatar,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -securityPin');
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = await User.findById(req.user._id);

        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;
            user.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || user.name)}&background=random`;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                uid: updatedUser.uid,
                balance: updatedUser.balance,
                avatar: updatedUser.avatar
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
});

// @route   PUT /api/auth/uid
// @desc    Regenerate UID (optional: keep old or create new)
// @access  Private
router.put('/uid', protect, async (req, res) => {
    try {
        const { regenerate } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (regenerate) {
            // Generate new UID
            let newUid = generateUID(user.name);
            let uidExists = await User.findOne({ uid: newUid });

            // If UID exists, regenerate until unique
            while (uidExists) {
                newUid = generateUID(user.name);
                uidExists = await User.findOne({ uid: newUid });
            }

            user.uid = newUid;
            await user.save();

            res.json({
                message: 'UID regenerated successfully',
                uid: user.uid
            });
        } else {
            res.json({
                message: 'Keeping existing UID',
                uid: user.uid
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating UID' });
    }
});

// @route   PUT /api/auth/pin
// @desc    Update security PIN
// @access  Private
router.put('/pin', protect, async (req, res) => {
    try {
        const { oldPin, newPin } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify old PIN
        const isMatch = await user.comparePin(oldPin);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect current PIN' });
        }

        // Update PIN
        user.securityPin = newPin;
        await user.save();

        res.json({ message: 'Security PIN updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating PIN' });
    }
});

export default router;
