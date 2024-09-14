// Import necessary modules
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const router = express.Router();
let users = [];

// JWT secret key
const secretKey = process.env.JWT_SECRET; // Use environment variable

// CREATE - POST /users (Sign up)
router.post('/users', [
    check('email').isEmail().withMessage('Must be a valid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = { id: users.length + 1, name, email, password: hashedPassword };
    users.push(newUser);

    res.status(201).json(newUser);
});

// LOGIN - POST /login (Generate JWT token)
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }

    try {
        const verified = jwt.verify(token, secretKey);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// READ - GET /users (Protected)
router.get('/users', authenticateJWT, (req, res) => {
    res.status(200).json(users);
});

// UPDATE - PUT /users/:id (Protected)
router.put('/users/:id', authenticateJWT, (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        const { name, email, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 8);
        user.name = name;
        user.email = email;
        user.password = hashedPassword;

        res.status(200).json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// DELETE - DELETE /users/:id (Protected)
router.delete('/users/:id', authenticateJWT, (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.status(204).json();
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = router;
