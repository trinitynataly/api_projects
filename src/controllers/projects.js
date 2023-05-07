/*
Version: 1.6
Last edited by: Natalia Pakhomova
Last edit date: 7/05/2023

Project module controller, managing CRUD operations for Projects
*/


// Import the multer middleware to handle file uploads
const multer = require('multer');
// Import the path module to extract file extensions
const path = require('path');
// Import the Project model
const Project = require('../models/projects');
// Import the Tag model
const Tag = require('../models/tags');

// Define a function to generate a unique ID
const generateId = () => {
    // Generate a random integer between 0 and 99999
    const randNum = Math.floor(Math.random() * 100000);
    // Get the current timestamp in milliseconds
    const timestamp = new Date().getTime();
    // Combine the random integer and timestamp to create a unique ID
    return `${randNum}${timestamp}`;
};

// Set up multer to store uploaded image files in the './public/projects' directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/projects');
    },
    filename: function (req, file, cb) {
        // Generate a unique filename for the uploaded file
        const ext = path.extname(file.originalname);
        // Call the callback function passing the unique filename
        const uniqueFilename = `${file.fieldname}-${generateId()}${ext}`;
        // Store the unique filename in the req object
        cb(null, uniqueFilename);
    }
});

// Create an instance of the multer middleware using the storage options
exports.uploadImage = multer({storage: storage});

// Export an async function to handle a GET (Read) request to retrieve all projects from the database
exports.getProjects = async (req, res) => {
    try {
        // Use the Project model to find all projects in the database, and populate the 'tags' field with tag objects
        const projects = await Project.find({}).populate('tags');
        // Create a new array of projects, replacing the 'tags' array with an array of tag names
        const projectsWithTagsAsNames = projects.map(project => ({
            ...project._doc,
            tags: project.tagNames
        }));
        // Send a JSON response with the new array of projects
        res.json(projectsWithTagsAsNames);
    } catch (error) { // If an error occurs while reading the project list
        // Return 400 (Bad Request) error with the error message
        res.status(400).json({error: error.message});
    }
};

// Export an async function to handle a POST (Create) request to create a new project in the database
exports.createProject = async (req, res) => {
    // Extract the project details from the request body
    const {title, summary, description, link, tags} = req.body;

    // Check if required fields are provided in the request body
    if (!title || !summary || !description) {
        // if not, send a 400 (Bad request) error with an error message
        return res.status(400).json({error: "Project title, summary and description are required!"});
    }
    try {
        // Create an empty array to store tag IDs
        const tagIds = [];
        // Create an empty array to store tag names
        const tagNames = [];
        // If tags are provided and are an array, process them
        if (tags && Array.isArray(tags)) {
            // Loop through each tag in the 'tags' array
            for (const tag of tags) {
                // Check if the tag already exists in the Tags collection by name (case-insensitive)
                let existingTag = await Tag.findOne({name: {$regex: new RegExp('^' + tag + '$', 'i')}});
                // Check if the tag record was found
                if (!existingTag) {
                    // If the tag doesn't exist, create a new one and save it
                    existingTag = new Tag({name: tag});
                    await existingTag.save();
                }
                // Push the tag ID and name to their respective arrays
                tagIds.push(existingTag._id);
                tagNames.push(existingTag.name);
            }
        }

        // Create a new project object with provided fields and tag IDs
        const project = new Project({
            title: title, // Project title
            summary: summary, // Project summary
            description: description, // Project description
            link: link, // Project link
            tags: tagIds // Project tags in array of tag IDs
        });
        // Save the project to the database
        const savedProject = await project.save();

        // Convert the saved project to a plain JavaScript object
        const projectResponse = savedProject.toObject();
        // Replace tag IDs with tag names in the response
        projectResponse.tags = tagNames;
        // Return the project response as JSON
        res.json(projectResponse);

    } catch (error) { // If an error occurs while creating the project
        // Return 400 (Bad Request) error with the error message
        res.status(400).json({error: error.message});
    }
};

// Export an async function to handle a GET (Read) request to retrieve a project by ID from the database
exports.getProject = async (req, res) => {
    try {
        // Use the Project model to find a project by ID in the database, and populate the 'tags' field with tag objects
        const project = await Project.findById(req.params.id).populate('tags');
        // Create a new array of projects, replacing the 'tags' array with an array of tag names
        const projectWithTagsAsNames = {
            ...project._doc,
            tags: project.tagNames
        };
        // Send a JSON response with the new array of projects
        res.json(projectWithTagsAsNames);
    } catch (error) { // If an error occurs while reading the project
        // Return 400 (Bad Request) error with the error message
        res.status(400).json({error: error.message});
    }
};

// Export an async function to handle a PUT (Update) request to update a project by its ID in the database
exports.updateProject = async (req, res) => {
    // Extract the request body parameters
    const {title, summary, description, link, tags} = req.body;

    // Check if the required fields are present in the request body
    if (!title || !summary || !description) {
        // Return an error response if required fields are missing
        return res.status(400).json({error: "Project title, summary and description are required!"});
    }

    try {
        // Create an empty array to store tag IDs
        const tagIds = [];
        // Create an empty array to store tag names
        const tagNames = [];
        // If the 'tags' parameter is provided and is an array, process it
        if (tags && Array.isArray(tags)) {
            // Loop through each tag in the 'tags' array
            for (const tag of tags) {
                // Check if the tag already exists in the Tags collection by name (case-insensitive)
                let existingTag = await Tag.findOne({name: {$regex: new RegExp('^' + tag + '$', 'i')}});
                // Check if the tag record was found
                if (!existingTag) {
                    // If the tag doesn't exist, create a new one and save it
                    existingTag = new Tag({name: tag});
                    await existingTag.save();
                }
                // Push the tag ID and name to their respective arrays
                tagIds.push(existingTag._id);
                tagNames.push(existingTag.name);
            }
        }
        // Attempt to find the project by ID and update it with the new parameters
        const project = await Project.findByIdAndUpdate(req.params.id, {
            title: title, // Project title
            summary: summary, // Project summary
            description: description, // Project description
            link: link, // Project link
            tags: tagIds // Project tags in array of tag IDs
        }, {new: true}); // Set the 'new' option to true to return the updated project object

        // Check if the project was found and updated successfully
        if (!project) {
            // If the project was not found, return a 404 (Not found) error
            return res.status(404).json({error: "Project not found!"});
        }
        // Convert the project object to a plain JavaScript object
        const projectResponse = project.toObject();
        // Set the 'tags' property of the projectResponse object to the 'tagNames' array
        projectResponse.tags = tagNames;
        // Send the projectResponse object as a JSON response
        res.json(projectResponse);
    } catch (error) {  // If an error occurs while updating the project
        // Return 400 (Bad Request) error with the error message
        res.status(400).json({error: error.message});
    }
};

// Export an async function to handle a PUT (Update) request to update a project image by its ID in the database
exports.saveImage = async (req, res) => {
    // Check if a project with the given ID exists in the database
    const project = await Project.findById(req.params.id).populate('tags');
    // Check if the project was found
    if (!project) {
        // If the project was not found, return a 404 (Not found) error
        return res.status(404).json({error: 'Project not found'});
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

    try {
        // Save the updated project object to the database
        const updatedProject = await project.save();

        // Send a JSON response with the updated project object
        const projectWithTagsAsNames = {
            ...project._doc,
            tags: project.tagNames
        };
        return res.json(projectWithTagsAsNames);
    } catch (error) { // If an error occurs while saving the project
        // Return 400 (Bad Request) error with the error message
        return res.status(400).json({error: error.message});
    }
}

// Export an async function to handle a DELETE (Delete) request to delete a project by its ID from the database
exports.deleteProject = async (req, res) => {
    try {
        // Attempt to find the project by ID and delete it
        const project = await Project.findByIdAndDelete(req.params.id);
        // Check if the project was found and deleted successfully
        if (!project) {
            // If the project was not found, return a 404 (Not found) error
            return res.status(404).json({error: 'Project not found'});
        }
        // Return a success response if the project was deleted successfully
        res.json({"message": "Project deleted successfully!"});
    } catch (error) { // If an error occurs while deleting the project
        // Return 400 (Bad Request) error with the error message
        res.status(400).json({error: error.message});
    }
};