/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 5/05/2023

Tag module router
*/

// Import the Express framework
const express = require('express');
// Create an instance of an Express router
const router = express.Router();

// Import the tags controller module
const tagController = require('../controllers/tags');
// Import the authentication middleware
const authenticateToken = require('../middlewares/auth');

// Mount the GET (Read) endpoint for retrieving all tags and map it to /api/tags/ route
router.get('/', tagController.getTags);
// Mount the POST (Create) endpoint for creating a new tag and map it to /api/tags/ route, protected by authentication middleware
router.post('/', authenticateToken, tagController.createTag);
// Mount the GET (Read) endpoint for retrieving a specific tag by ID and map it to /api/tags/:id route
router.get('/:id', tagController.getTag);
// Mount the PUT (Update) endpoint for updating a specific tag by ID and map it to /api/tags/:id route, protected by authentication middleware
router.put('/:id', authenticateToken, tagController.updateTag);
// Mount the DELETE endpoint for deleting a specific tag by ID and map it to /api/tags/:id route, protected by authentication middleware
router.delete('/:id', authenticateToken, tagController.deleteTag);

// Export the router for use in other modules
module.exports = router;