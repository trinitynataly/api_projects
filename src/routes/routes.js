/*
Version: 1.2
Last edited by: Natalia Pakhomova
Last edit date: 7/05/2023

Main application router
*/

// Import the Express framework
const express = require('express');
// Create an instance of an Express router
const router = express.Router();

// Import the API routes for authentication-related requests
const authRouter = require('./auth');
// Import the API routes for user-related requests
const userRouter = require('./users');
// Import the API routes for project-related requests
const projectRouter = require('./projects');
// Import the API routes for tag-related requests
const tagRouter = require('./tags');

// Mount the authentication-related API routes at the /api/auth endpoint
router.use('/auth', authRouter);
// Mount the user-related API routes at the /api/users endpoint
router.use('/users', userRouter);
// Mount the project-related API routes at the /api/projects endpoint
router.use('/projects', projectRouter);
// Mount the tag-related API routes at the /api/tags endpoint
router.use('/tags', tagRouter);

// Export the router for use in other modules
module.exports = router;
