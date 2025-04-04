// routes/entriesRoutes.js
const express = require('express');
const router = express.Router();
const cors = require('cors');
const Entry = require('../models/Entry'); // You'll need to create this model
const authMiddleware = require('../middlewares/authMiddleware');

// POST /entries
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { date, quantity, price } = req.body;
    
    // Create new entry
    const entry = new Entry({
      user: req.userId, // From authMiddleware
      date,
      quantity,
      price
    });

    await entry.save();

    res.status(201).json({
      success: true,
      message: 'Entry created successfully',
      entry
    });

  } catch (err) {
    console.error('Error creating entry:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// GET all entries
router.get('/', authMiddleware, async (req, res) => {
    try {
      const entries = await Entry.find({ user: req.userId })
        .sort({ date: -1 });
        
      res.json(entries);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

router.options('/:id', cors()); 
// In entriesRoutes.js - Make sure this exists
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const deletedEntry = await Entry.findOneAndDelete({
        _id: req.params.id,
        user: req.userId // Ensures users can only delete their own entries
      });
  
      if (!deletedEntry) {
        return res.status(404).json({ message: 'Entry not found' });
      }
  
      res.json({ success: true, message: 'Entry deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;