// Backend: routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Password validation function
const validatePassword = (password) => {
  const validationErrors = [];
  
  // Length check
  if (password.length < 8) {
    validationErrors.push('Password must be at least 8 characters long');
  }
  
  // Uppercase letter check
  if (!/[A-Z]/.test(password)) {
    validationErrors.push('Password must contain at least one uppercase letter');
  }
  
  // Lowercase letter check
  if (!/[a-z]/.test(password)) {
    validationErrors.push('Password must contain at least one lowercase letter');
  }
  
  // Number check
  if (!/\d/.test(password)) {
    validationErrors.push('Password must contain at least one number');
  }
  
  // Special character check
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    validationErrors.push('Password must contain at least one special character');
  }

  return validationErrors;
};

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: 'All fields are required',
        errorType: 'VALIDATION_ERROR'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email is already registered. Please login instead.',
        errorType: 'USER_EXISTS'
      });
    }

    // Validate password strength
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        message: 'Password is not strong enough',
        errorType: 'WEAK_PASSWORD',
        errors: passwordErrors
      });
    }

    // Create new user
    const user = new User({ email, password, name });
    await user.save();
    
    res.status(201).json({ 
      message: 'Registration successful! Please login.',
      success: true 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed. Please try again.',
      errorType: 'SERVER_ERROR'
    });
  }
});

module.exports = router;

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required',
        errorType: 'VALIDATION_ERROR'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'You are not registered. Please register first.',
        errorType: 'USER_NOT_FOUND'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Incorrect password. Please try again.',
        errorType: 'INVALID_PASSWORD'
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Login failed. Please try again.',
      errorType: 'SERVER_ERROR'
    });
  }
});

module.exports = router;