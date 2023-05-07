/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 7/05/2023

Tags module controller, managing CRUD operations for Tags
*/

// Import the Tag model
const Tag = require('../models/tags');
// Import the Project model
const Project = require('../models/projects');

// Export an async function to handle a GET (Read) request to retrieve all tags from the database
exports.getTags = async (req, res) => {
    try {
        // Find all tags in the database
        const tags = await Tag.find({});
        // Return the tags in the response
        res.json(tags);
    } catch (error) { // Catch any errors that might occur
        // Return a 400 error with the error message
        res.status(400).json({error: error.message});
    }
};

// Export an async function to handle a POST (Create) request to add a new tag to the database
exports.createTag = async (req, res) => {
    // Extract the name from the request body object
    const {name} = req.body;

    // Check if the name is missing
    if (!name) {
        // If so, return a 400 error with an error message
        return res.status(400).json({error: "Tag name is required!"});
    }

    try {
        // Create a new tag with the extracted name
        const tag = new Tag({
            name: name // Tag name
        });
        // Save the tag to the database
        const savedTag = await tag.save();
        // Return the saved tag in the response
        res.json(savedTag);
    } catch (error) { // Catch any errors that might occur
        // Check if the error is a MongoDB duplicate key error
        if (error.name === 'MongoError' && error.code === 11000) {
            // If so, return a 400 error with an error message that the tag name must be unique
            return res.status(400).json({error: 'Tag name must be unique!'});
        }
        // For all other errors, return a 400 error with the error message
        res.status(400).json({error: error.message});
    }
};

// Export an async function to handle a GET (Read) request to retrieve a specific tag from the database
exports.getTag = async (req, res) => {
    try {
        // Find the tag with the specified ID
        const tag = await Tag.findById(req.params.id);
        // Return the tag in the response
        res.json(tag);
    } catch (error) { // Catch any errors that might occur
        // Return a 400 error with the error message
        res.status(400).json({error: error.message});
    }
};

// Export an async function to handle a PUT (Update) request to update a specific tag in the database
exports.updateTag = async (req, res) => {
    // Extract the name from the request body object
    const {name} = req.body;

    // Check if the name is missing
    if (!name) {
        // If so, return a 400 error with an error message
        return res.status(400).json({error: "Tag name is required!"});
    }

    try {
        // Find the tag with the specified ID
        const tag = await Tag.findById(req.params.id);

        // Check if the tag exists
        if (!tag) {
            // If not, return a 404 error with an error message
            return res.status(404).json({error: "Tag not found!"});
        }

        // Check if the tag name is the same as the name in the request body
        if (tag.name !== name) {
            // Check if the supplied name is in fact the same but with different case
            if (tag.name.toLowerCase() !== name.toLowerCase()) {
                // If not, check if a tag with the same name already exists
                const existingTag = await Tag.findOne({name: {$regex: new RegExp('^' + name + '$', 'i')}});
                // Check if a tag with the same name found
                if (existingTag) {
                    // If so, return a 400 error with an error message that the tag name must be unique
                    return res.status(400).json({error: "Tag name must be unique!"});
                }
            }
            // Update tag with the new name
            tag.name = name;
            // Save the updated tag to the database
            await tag.save();
        }

        // Return the updated tag in the response
        res.json(tag);
    } catch (error) { // Catch any errors that might occur
        // Return a 400 error with the error message
        res.status(400).json({error: error.message});
    }
};

// Export an async function to handle a DELETE (Delete) request to delete a specific tag from the database
exports.deleteTag = async (req, res) => {
    try {
        // Find the tag with the specified ID
        const tag = await Tag.findById(req.params.id);
        // Check if the tag exists
        if (!tag) {
            // If not, return a 404 error with an error message
            return res.status(404).json({error: 'Tag not found'});
        }

        // Remove the tag from all projects that it is linked to
        await Project.updateMany({tags: tag._id}, {$pull: {tags: tag._id}});

        // Delete the tag
        await tag.deleteOne();

        // Return a success message in the response
        res.json({"message": "Tag deleted successfully!"});
    } catch (error) { // Catch any errors that might occur
        // Return a 400 error with the error message
        res.status(400).json({error: error.message});
    }
};