const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ username, email, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, '9eee75143d722178353079853a6daf32b016546b5e0744576c6f202d2126a4d6', { expiresIn: '24h' });
    res.status(201).json({ 
      message: 'Account created successfully!', 
      token,
      username: user.username
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, '9eee75143d722178353079853a6daf32b016546b5e0744576c6f202d2126a4d6', { expiresIn: '24h' });
    res.json({ 
      message: 'Login successful', 
      token,
      username: user.username
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/change-password', authMiddleware, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
      user.password = newPassword;
      await user.save();
      res.json({
        success: true,
        message: 'Password updated successfully'
      });
    } catch (err) {
      console.error('Password change error:', err);
      res.status(500).json({
        success: false,
        message: 'Error changing password'
      });
    }
  });
router.get('/me', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.userId).select('-password');
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'User not found' 
        });
      }
      
      res.json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    } catch (err) {
      console.error('Error in /me:', err);
      res.status(500).json({ 
        success: false,
        message: 'Server error' 
      });
    }
  });
module.exports = router;
