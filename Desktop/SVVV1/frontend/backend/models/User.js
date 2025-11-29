import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    uid: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 5000,
        min: 0
    },
    securityPin: {
        type: String,
        required: true,
        length: 4
    },
    avatar: {
        type: String,
        default: function () {
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=random`;
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Hash security PIN before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('securityPin')) return next();

    const salt = await bcrypt.genSalt(10);
    this.securityPin = await bcrypt.hash(this.securityPin, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Compare security PIN method
userSchema.methods.comparePin = async function (candidatePin) {
    return await bcrypt.compare(candidatePin, this.securityPin);
};

const User = mongoose.model('User', userSchema);

export default User;
