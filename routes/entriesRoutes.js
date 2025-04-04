const express = require('express');
const router = express.Router();
const cors = require('cors');
const Entry = require('../models/Entry');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { date, quantity, price } = req.body;
    const entry = new Entry({
      user: req.userId,
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
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const deletedEntry = await Entry.findOneAndDelete({
        _id: req.params.id,
        user: req.userId
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
