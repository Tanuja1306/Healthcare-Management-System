// backend/server.js

const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

// Initialize dotenv to load environment variables
dotenv.config();

// Create an Express application
const app = express();

// CORS configuration
const corsOptions = {
    origin: '*', // Allows all origins; restrict this to specific origins if needed
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(bodyParser.json()); // Body parser middleware
app.use(cors(corsOptions)); // Enable CORS with options

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Apply rate limiting globally (100 requests per 15 minutes)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Import routes
const userRoutes = require('./routes/userRoutes');

// Define API routes
app.use('/api', userRoutes);  // User profile and JWT routes

// Import web routes
const webRoutes = require('./routes/webRoutes');
app.use('/', webRoutes); // Public pages

// Error handling middleware for unknown routes
app.use((req, res, next) => {
    res.status(404).send('Page not found');
});

// General error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server error');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
