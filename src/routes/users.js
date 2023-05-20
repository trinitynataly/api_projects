/*
Version: 1.5
Last edited by: Natalia Pakhomova
Last edit date: 14/05/2023

User module router
*/

// Import the Express framework
const express = require('express');
// Create an instance of an Express router
const router = express.Router();
// Import the JWT authentication middleware
const {authenticateToken} = require('../helpers/auth');
// Import the users controller module
const userController = require('../controllers/users');

// Mount the GET (Read) endpoint for retrieving all users and map it to /api/users/ route, protected by authentication middleware
router.get('/', authenticateToken, userController.getUsers);
// Mount the POST (Create) endpoint for creating a new user and map it to /api/users/ route, protected by authentication middleware
router.post('/', authenticateToken, userController.createUser);
// Mount the GET (Read) endpoint for retrieving a specific user by ID and map it to /api/users/:id route, protected by authentication middleware
router.get('/:id', authenticateToken, userController.getUser);
// Mount the PUT (Update) endpoint for updating a specific user by ID and map it to /api/users/:id route, protected by authentication middleware
router.put('/:id', authenticateToken, userController.updateUser);
// Mount the DELETE endpoint for deleting a specific user by ID and map it to /api/users/:id route, protected by authentication middleware
router.delete('/:id', authenticateToken, userController.deleteUser);

// Export the router for use in other modules
module.exports = router;