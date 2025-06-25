// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(express.json());
app.use(bodyParser.json());
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(express.static(path.join(__dirname, '../frontend')));

// Import user routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes); // Updated path for user routes

// Import the new health record routes
const healthRecordRoutes = require('./routes/healthRecordRoutes');
app.use('/api/health-records', healthRecordRoutes); // Correct path for health record routes

// Web routes
const webRoutes = require('./routes/webRoutes');
app.use('/', webRoutes);

// Error handling middleware for unknown routes
app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

// General error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
