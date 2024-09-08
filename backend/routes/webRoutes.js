// backend/routes/webRoutes.js

const express = require('express');
const path = require('path');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Import the dummy middleware
const userController = require('../controllers/userController'); // Import the user controller

// Route to serve the homepage
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// Route to serve the signup page
router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/signup.html'));
});

// Route to serve the signin page
router.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/signin.html'));
});

// Route to serve the dashboard page, protected by authentication middleware
router.get('/dashboard', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dashboard.html'));
});

// Route to serve the profile page, protected by authentication middleware
router.get('/profile', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/profile.html'));
});

// Auth routes
router.post('/api/signup', userController.signup); // Updated path to include /api
router.post('/api/signin', userController.signin); // Updated path to include /api

// Catch-all route for non-existent pages
router.get('*', (req, res) => {
    res.status(404).send('Page not found');
});

module.exports = router;
