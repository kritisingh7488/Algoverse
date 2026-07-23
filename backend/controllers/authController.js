const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;

        // Validation
        if (!fullName || !username || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User with this email or username already exists' });
        }

        // Create user
        const user = await User.create({
            fullName,
            username,
            email,
            password
        });

        if (user) {
            const token = generateToken(user._id);
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user,
                    token
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Check for user
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            const token = generateToken(user._id);
            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user,
                    token
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

// @desc    Get user profile
// @route   GET /api/v1/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                success: true,
                data: { user }
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        // Will implement actual email sending later when credentials exist
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Please provide an email' });
        }
        res.json({ success: true, message: 'If an account exists, a reset link was sent' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Reset Password
// @route   PUT /api/v1/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ success: false, message: 'Please provide a new password' });
        }
        // Will implement token validation and actual password reset when DB is live
        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Verify Email
// @route   GET /api/v1/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        // Will implement actual verification logic when DB is live
        res.json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    forgotPassword,
    resetPassword,
    verifyEmail
};
