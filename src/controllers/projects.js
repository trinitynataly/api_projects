/*
Version: 1.7
Last edited by: Natalia Pakhomova
Last edit date: 14/05/2023

Project module controller, managing CRUD operations for Projects
*/

// Import the HTTP errors library for creating HTTP errors
const createError = require('http-errors');
// Import the helper function to extract fields from an object
const {extractFields, handleDBError} = require("../helpers/data");
// Import helper function to find or create tags
const {findOrCreateTags} = require("../helpers/tags");
// Import the Project model
const {Project, validateProject} = require('../models/projects');

// Export an async function to handle a GET (Read) request to retrieve all projects from the database
exports.getProjects = async (req, res, next) => {
    try {
        // Use the Project model to find all projects in the database, and populate the 'tags' field with tag objects
        const projects = await Project.find({}).populate('tags');
        // Create a new array of projects, replacing the 'tags' array with an array of tag names
        const projectsWithTagsAsNames = projects.map(project => ({
            ...project._doc, tags: project.tagNames
        }));
        // Send a JSON response with the new array of projects
        res.json(projectsWithTagsAsNames);
    } catch (error) { // If an error occurs while reading the project list
        // If there was an error return the error message
        handleDBError(res, error, next);
    }
};

// Export an async function to handle a GET (Read) request to retrieve a project by ID from the database
exports.getProject = async (req, res, next) => {
    try {
        // Use the Project model to find a project by ID in the database, and populate the 'tags' field with tag objects
        const project = await Project.findById(req.params.id).populate('tags');
        // Check if the project was found
        if (!project) {
            // If the project was not found, return a 404 (Not found) error
            throw createError(404, 'Project not found!');
        }
        // Create a new array of projects, replacing the 'tags' array with an array of tag names
        const projectWithTagsAsNames = {
            ...project._doc, tags: project.tagNames
        };
        // Send a JSON response with the new array of projects
        res.json(projectWithTagsAsNames);
    } catch (error) { // If an error occurs while reading the project
        // If there was an error return the error message
        handleDBError(res, error, next);
    }
};

// Export an async function to handle a POST (Create) request to create a new project in the database
exports.createProject = async (req, res, next) => {
    try {
        // Extract the project details from the request body
        const projectData = extractFields(req.body, ['title', 'summary', 'description', 'link', 'tags']);
        // Validate the project details using Joi
        const {error} = validateProject(projectData);
        // If the validation fails, return a 400 (Bad Request) error with the error message
        if (error) throw createError(400, error.details[0].message);
        // Find or create tags from the 'tags' field in the request body, and store the tag IDs and names in variables
        const {tagIds, tagNames} = await findOrCreateTags(projectData.tags);
        // Replace the 'tags' field in the project data with the tag IDs
        projectData.tags = tagIds;
        // Create a new project object with provided fields and tag IDs
        const project = new Project(projectData);
        // Save the project to the database
        const savedProject = await project.save();
        // Convert the saved project to a plain JavaScript object
        const projectResponse = savedProject.toObject();
        // Replace tag IDs with tag names in the response
        projectResponse.tags = tagNames;
        // Return the project response as JSON
        res.json(projectResponse);
    } catch (error) { // If an error occurs while creating the project
        // If there was an error return the error message
        handleDBError(res, error, next);
    }
};

// Export an async function to handle a PUT (Update) request to update a project by its ID in the database
exports.updateProject = async (req, res, next) => {
    try {
        // Extract the project details from the request body
        const projectData = extractFields(req.body, ['title', 'summary', 'description', 'link', 'tags']);
        // Validate the project details using Joi
        const {error} = validateProject(projectData);
        // If the validation fails, return a 400 (Bad Request) error with the error message
        if (error) throw createError(400, error.details[0].message);
        // Find or create tags from the 'tags' field in the request body, and store the tag IDs and names in variables
        const {tagIds, tagNames} = await findOrCreateTags(projectData.tags);
        // Replace the 'tags' field in the project data with the tag IDs
        projectData.tags = tagIds;
        // Attempt to find the project by ID and update it with the new parameters
        const project = await Project.findByIdAndUpdate(req.params.id, projectData, {new: true, runValidators: true}); // Set the 'new' option to true to return the updated project object
        // Check if the project was found and updated successfully
        if (!project) {
            // If the project was not found, return a 404 (Not found) error
            throw createError(404, 'Project not found!');
        }
        // Convert the project object to a plain JavaScript object
        const projectResponse = project.toObject();
        // Set the 'tags' property of the projectResponse object to the 'tagNames' array
        projectResponse.tags = tagNames;
        // Send the projectResponse object as a JSON response
        res.json(projectResponse);
    } catch (error) {  // If an error occurs while updating the project
        // If there was an error return the error message
        handleDBError(res, error, next);
    }
};

// Export an async function to handle a PUT (Update) request to update a project image by its ID in the database
exports.saveImage = async (req, res, next) => {
    try {
        // Check if a project with the given ID exists in the database, and populate the 'tags' field with tag names
        const project = await Project.findById(req.params.id).populate('tags');
        // If the project is not found, throw a custom error
        if (!project) {
            throw createError(404, 'Project not found!');
        }
        // Process the uploaded file
        let image = '';
        // Check if an image file was uploaded
        if (req.file) {
            // If an image file was uploaded, set the image path to the path of the uploaded file
            image = req.file.path;
        }
        // Update the project object with the new image path (if any)
        project.image = image;
        // Save the updated project object to the database
        const updatedProject = await project.save();
        // Send a JSON response with the updated project object
        const projectWithTagsAsNames = {
            ...updatedProject._doc, tags: updatedProject.tagNames
        };
        return res.json(projectWithTagsAsNames);
    } catch (error) { // If an error occurs while saving the project
        // If there was an error return the error message
        handleDBError(res, error, next);
    }
}

// Export an async function to handle a DELETE (Delete) request to delete a project by its ID from the database
exports.deleteProject = async (req, res, next) => {
    try {
        // Attempt to find the project by ID and delete it
        const project = await Project.findByIdAndDelete(req.params.id);
        // Check if the project was found and deleted successfully
        if (!project) {
            // If the project was not found, return a 404 (Not found) error
            throw createError(404, 'Project not found!');
        }
        // Return a success response if the project was deleted successfully
        res.json({"message": "Project deleted successfully!"});
    } catch (error) { // If an error occurs while deleting the project
        // If there was an error return the error message
        handleDBError(res, error, next);
    }
};