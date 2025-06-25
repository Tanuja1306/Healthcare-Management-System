// backend/routes/webRoutes.js

const express = require('express');
const path = require('path');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Import the authentication middleware
const userController = require('../controllers/userController'); // Import the user controller
router.use(express.static('public'));

// Route to serve the homepage (Public)
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// Route to serve the signup page (Public)
router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/signup.html'));
});

// Route to serve the signin page (Public)
router.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/signin.html'));
});

// Route to serve the dashboard page (Protected)
router.get('/dashboard', authMiddleware, (req, res) => {
    console.log('Sending response from /dashboard');
    
    // Assuming authMiddleware sets req.user if token is valid
    if (req.user) {
        // Token is valid, send the dashboard page
        res.sendFile(path.join(__dirname, '../../frontend/dashboard.html'));
    } else {
        // If no valid user, return a 401 Unauthorized status
        res.status(401).json({ message: 'Unauthorized access. Please log in.' });
    }
});

// Route to serve the profile page (Protected)
router.get('/profile', authMiddleware, (req, res) => {
    console.log('Sending response from /profile');

    // Assuming authMiddleware sets req.user if token is valid
    if (req.user) {
        // Token is valid, send the profile page
        res.sendFile(path.join(__dirname, '../../frontend/profile.html'));
    } else {
        // If no valid user, return a 401 Unauthorized status
        res.status(401).json({ message: 'Unauthorized access. Please log in.' });
    }
});

// Auth routes
router.post('/api/signup', userController.signup); // Path to include /api
router.post('/api/signin', userController.signin); // Path to include /api

// Catch-all route for non-existent pages
router.get('*', (req, res) => {
    res.status(404).send('Page not found');
});

module.exports = router;
