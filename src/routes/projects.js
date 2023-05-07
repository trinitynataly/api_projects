/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 7/05/2023

Project module router
*/

// Import the Express framework
const express = require('express');
// Create an instance of an Express router
const router = express.Router();

// Import the projects controller module
const projectController = require('../controllers/projects');
// Import the authentication middleware
const authenticateToken = require('../middlewares/auth');

// Mount the GET (Read) endpoint for retrieving all projects and map it to /api/projects/ route
router.get('/', projectController.getProjects);
// Mount the POST (Create) endpoint for creating a new project and map it to /api/projects/ route, protected by authentication middleware
router.post('/', authenticateToken, projectController.createProject);
// Mount the GET (Read) endpoint for retrieving a specific project by ID and map it to /api/projects/:id route
router.get('/:id', projectController.getProject);
// Mount the PUT (Update) endpoint for updating a specific project by ID and map it to /api/projects/:id route, protected by authentication middleware
router.put('/:id', authenticateToken, projectController.updateProject);
// Mount the PUT (Update) endpoint for updating the image of a specific project by ID and map it to /api/projects/:id/upload route, protected by authentication middleware
router.put('/:id/upload', authenticateToken, projectController.uploadImage.single('image'), projectController.saveImage);
// Mount the DELETE endpoint for deleting a specific project by ID and map it to /api/projects/:id route, protected by authentication middleware
router.delete('/:id', authenticateToken, projectController.deleteProject);

// Export the router for use in other modules
module.exports = router;
