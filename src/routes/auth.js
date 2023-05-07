/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 5/05/2023

Authentication module router
*/

// Import the Express framework
const express = require('express');
// Create an instance of an Express router
const router = express.Router();
// Import the API routes for authentication-related requests
const authController = require('../controllers/auth');

// Mount the POST login endpoint at the /api/auth/login route and map it to the login controller function
router.post('/login', authController.login);
// Mount the POST refresh token endpoint at the /api/auth/refresh route and map it to the refreshToken controller function
router.post('/refresh', authController.refreshToken);

// Export the router for use in other modules
module.exports = router;