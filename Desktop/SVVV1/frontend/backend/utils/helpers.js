import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Generate UID based on user's name
export const generateUID = (name) => {
    // Remove spaces and special characters
    const cleanName = name.replace(/[^a-zA-Z]/g, '');

    // Generate 4 random digits
    const randomDigits = Math.floor(1000 + Math.random() * 9000);

    // Combine name and digits
    const uid = `${cleanName}${randomDigits}`;

    return uid;
};

// Generate blockchain hash
export const generateHash = (data) => {
    return '0x' + crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
};

// Generate JWT token
export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};
