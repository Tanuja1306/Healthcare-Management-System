// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Retrieve the authorization header from the request
    const authHeader = req.headers['authorization'];

    // Log the received authorization header
    console.log('Authorization Header:', authHeader);

    // Check if the authorization header is missing
    if (!authHeader) {
        console.log('No token provided');
        return res.redirect('/signin.html'); // Redirect to sign-in page
    }

    // Extract the token from the header
    const token = authHeader.split(' ')[1];

    // Check if the token is missing
    if (!token) {
        console.log('No token provided');
        return res.redirect('/signin.html'); // Redirect to sign-in page
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        // Log the error if token verification fails
        if (err) {
            console.log('Invalid token:', err.message);
            return res.redirect('/signin.html'); // Redirect to sign-in page
        }

        // Log the decoded token data
        console.log('Token decoded:', decoded);

        // Attach the user information to the request
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    });
};

module.exports = authMiddleware;
