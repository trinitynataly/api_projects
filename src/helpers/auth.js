/*
Version: 1.2
Last edited by: Natalia Pakhomova
Last edit date: 14/05/2023

Helper functions for JWT token validation and password hashing
*/

// Import the JSON Web Token library for working with authentication tokens
const jwt = require('jsonwebtoken');
// Import the bcrypt module for hashing passwords
const bcrypt = require('bcrypt');


// Define a middleware function for authenticating requests with a JWT
const authenticateToken = (req, res, next) => {
    // Get the value of the 'Authorization' header from the incoming request
    const authHeader = req.headers['authorization'];
    // Extract the JWT from the 'Authorization' header
    const token = authHeader && authHeader.split(' ')[1];
    // Check if token had been supplied
    if (!token) {
        // If no token was found, return an error response
        return res.status(401).json({error: 'Unauthorized'});
    }
    // Verify the authenticity of the JWT using the JWT_SECRET environment variable
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) { // If the JWT is invalid, return an error response
            return res.status(403).json({error: 'Invalid token'});
        }
        // If the JWT is valid, decode its payload and attach it to the request object for use by downstream middleware and routes
        req.user = decoded;
        // Call the next middleware function in the stack
        next();
    });
};

// Define a helper function for hashing passwords
const encryptPassword = async (password) => {
    // Set the number of salt rounds
    const saltRounds = 10;
    // Generate a salt and use it to hash the password
    const salt = await bcrypt.genSalt(saltRounds);
    // Return the hashed password from the password + salt combination
    return await bcrypt.hash(password, salt);
}

// Define a helper function for validating passwords
const validatePassword = async (password, hash) => {
    // Compare the password with the hash and return the result
    return await bcrypt.compare(password, hash);
}

// Export the helper functions
module.exports = {authenticateToken, encryptPassword, validatePassword};