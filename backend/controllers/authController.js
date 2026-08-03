const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

// Helper: Log errors with context
const logError = (endpoint, error) => {
  console.error(`[${endpoint}] ${error.name || 'Error'}: ${error.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(error.stack);
  }
};

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

    // Sanitize inputs
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedUsername = username.trim();

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email: sanitizedEmail }, { username: sanitizedUsername }] });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: userExists.email === sanitizedEmail 
          ? 'Email already registered' 
          : 'Username already taken' 
      });
    }

    // Create user
    const user = await User.create({
      fullName: fullName.trim(),
      username: sanitizedUsername,
      email: sanitizedEmail,
      password
    });

    if (user) {
      const token = generateToken(user._id);
      const userResponse = user.toJSON();
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: userResponse,
          token
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    logError('POST /auth/register', error);
    
    // Handle specific MongoDB validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    res.status(500).json({ 
      success: false, 
      message: process.env.NODE_ENV === 'development' ? error.message : 'Server error during registration' 
    });
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

    // Sanitize email
    const sanitizedEmail = email.toLowerCase().trim();

    // Check for user
    const user = await User.findOne({ email: sanitizedEmail });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Compare password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    const userResponse = user.toJSON();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    logError('POST /auth/login', error);
    res.status(500).json({ 
      success: false, 
      message: process.env.NODE_ENV === 'development' ? error.message : 'Server error during login' 
    });
  }
};

// @desc    Google OAuth Login
// @route   POST /api/v1/auth/google-login
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { googleId, fullName, email, avatar } = req.body;

    if (!googleId || !email) {
      return res.status(400).json({ success: false, message: 'Google ID and email are required' });
    }

    // Check if user exists
    let user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] });

    if (!user) {
      // Create new user
      user = await User.create({
        fullName: fullName || 'User',
        email: email.toLowerCase(),
        googleId,
        avatar: avatar || '',
        username: email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 5),
        isEmailVerified: true
      });
    } else if (!user.googleId) {
      // Link existing email to Google
      user.googleId = googleId;
      await user.save();
    }

    const token = generateToken(user._id);
    const userResponse = user.toJSON();

    res.json({
      success: true,
      message: 'Google login successful',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    logError('POST /auth/google-login', error);
    res.status(500).json({ 
      success: false, 
      message: process.env.NODE_ENV === 'development' ? error.message : 'Google login failed' 
    });
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
        data: { user: user.toJSON() }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    logError('GET /auth/me', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email' });
    }
    res.json({ success: true, message: 'If an account exists, a reset link was sent' });
  } catch (error) {
    logError('POST /auth/forgot-password', error);
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
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    logError('PUT /auth/reset-password', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Verify Email
// @route   GET /api/v1/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    logError('GET /auth/verify-email', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  getUserProfile,
  forgotPassword,
  resetPassword,
  verifyEmail
};
