/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 14/05/2023

Authentication module controller, handles all authentication-related requests
*/

// Import JSON Web Token (JWT) module for creating and verifying tokens
const jwt = require("jsonwebtoken");
// Import the extractFields helper function for extracting fields from POST request body
const {extractFields} = require("../helpers/data");
// Import the RefreshToken model
const {RefreshToken} = require('../models/auth');
// Import the validatePassword helper function for validating passwords
const {validatePassword} = require('../helpers/auth');
// Import the User model
const {User, validateLogin} = require('../models/users');

// Create and export the login controller function
exports.login = async (req, res) => {
    const authData = extractFields(req.body, ['email', 'password']);
    // Validate the request body using the authJoiSchema Joi schema
    const {error} = validateLogin(authData);
    // If the validation fails, return a 400 (Bad Request) error with the error message
    if (error) return res.status(400).json({error: error.details[0].message});
    try {
        // Find the user associated with the email provided by the user (using case-insensitive search)
        const user = await User.findOne({email: {$regex: new RegExp(authData.email, 'i')}});
        // Check if the user was found
        if (!user) {
            // If the user wasn't found return 404 (Not Found)
            return res.status(404).json({error: "User not found"});
        }
        // Check if the password provided matches the password of the user with validatePassword helper function
        const validPassword = await validatePassword(authData.password, user.password);
        // Check if the password was valid
        if (!validPassword) {
            // If the password wasn't valid return 401 (Unauthorized)
            return res.status(401).json({error: "Invalid password"});
        }
        // Create and assign a token with the user ID as payload and the secret key from the environment variables
        const accessToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
        // Create and assign a refresh token with the user ID as payload and the secret key from the environment variables
        const refreshToken = jwt.sign({id: user._id}, process.env.JWT_REFRESH_SECRET);
        // Create a new RefreshToken document with the user ID, the refresh token and the expiration date
        const refreshTokenRow = new RefreshToken({
            user: user._id, // assign the _id from the user
            token: refreshToken, // assign the refresh token
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // assign the expiration date 7 days in the future
        });
        // Save the refresh token to the database
        await refreshTokenRow.save();
        // Convert the user document to a plain JS object
        const userResponse = user.toObject();
        // Remove the password from the userResponse object
        delete userResponse.password;
        // Return the access token, the refresh token and the user data
        res.status(200).json({
            access_token: accessToken,
            refresh_token: refreshToken,
            user: userResponse
        });
    } catch (error) {
        // If there was an error return 500 (Internal Server Error) with the error message
        res.status(500).json({error: error.message});
    }
};

// Create and export the refreshToken controller function
exports.refreshToken = async (req, res) => {
    const refreshData = extractFields(req.body, ['refresh_token'], "");
    try {
        // Get the refresh token from the request body
        const refreshToken = refreshData.refresh_token;
        // Find a matching refresh token in the database
        const refreshTokenRow = await RefreshToken.findOne({token: refreshToken});
        // Check if the refresh token was found
        if (!refreshTokenRow) {
            // If the refresh token wasn't found return 401 (Unauthorized)
            return res.status(401).json({error: 'Invalid token'});
        }
        // Verify the refresh token using the JWT library and the secret key from the environment variables
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            // Check if there was an error verifying the refresh token
            if (err) {
                // If there was an error, delete the refresh token from the database
                await refreshTokenRow.delete();
                // Return 401 (Unauthorized)
                return res.status(401).json({error: 'Invalid token'});
            }
            // Get the user ID from the decoded refresh token
            const user = decoded.id;
            // Create and assign a new access token with the user ID as payload and the secret key from the environment variables
            const accessToken = jwt.sign({id: user}, process.env.JWT_SECRET, {expiresIn: '1h'});
            // Return the access token
            return res.status(200).json({access_token: accessToken});
        });
    } catch (error) {
        // If there was an error return 500 (Internal Server Error) with the error message
        res.status(500).json({error: error.message});
    }
};