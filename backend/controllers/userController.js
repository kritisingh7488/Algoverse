const User = require('../models/User');

// @desc    Get user profile & stats
// @route   GET /api/v1/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching profile',
            error: error.message
        });
    }
};

// @desc    Update user profile details
// @route   PUT /api/v1/user/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Validate email uniqueness if changing email
        if (req.body.email && req.body.email !== user.email) {
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already in use by another account'
                });
            }
        }

        // Update fields
        user.fullName = req.body.fullName || user.fullName;
        user.email = req.body.email || user.email;
        if (req.body.avatar !== undefined) {
            user.avatar = req.body.avatar;
        }
        
        // Save the updated user
        const updatedUser = await user.save();
        
        // Remove password before sending
        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: userResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error updating profile',
            error: error.message
        });
    }
};

// @desc    Update user password
// @route   PUT /api/v1/user/password
// @access  Private
const updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // If the user has a password, verify the current password
        if (user.password && !req.body.currentPassword) {
            return res.status(400).json({ success: false, message: 'Current password is required' });
        }
        
        if (user.password) {
            const isMatch = await user.comparePassword(req.body.currentPassword);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Incorrect current password' });
            }
        }

        if (!req.body.newPassword || req.body.newPassword.length < 8) {
            return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
        }

        user.password = req.body.newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error updating password',
            error: error.message
        });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    updatePassword
};
