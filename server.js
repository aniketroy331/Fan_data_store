require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const entriesRoutes = require('./routes/entriesRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect('mongodb+srv://aniketroy:fan-data-entry@cluster0.7wjpa5k.mongodb.net/auth_app?retryWrites=true&w=majority&appName=Cluster0' ,{
      useNewUrlParser: true,
      useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
// app.use('/api/auth', authRoutes);
app.use('/api/auth',authRoutes);

app.use('/api/entries', entriesRoutes);

// Error handling middleware (put this LAST)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
      success: false,
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });
  
  // 404 handler (put this before error middleware)
app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Endpoint not found'
    });
  });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
