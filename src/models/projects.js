/*
Version: 1.4
Last edited by: Natalia Pakhomova
Last edit date: 14/05/2023

Project Schema for storing Projects in database
*/

// Import the Mongoose library
const mongoose = require('mongoose');
// Import the Joi library for validating schemas
const Joi = require('joi');
// Destructure the Schema object from the Mongoose library
const {Schema} = mongoose;

// Define the projects schema using the Schema object
const projectsSchema = new Schema({
    // Title of the project (required)
    title: { type: String, required: true },
    // Short summary of the project (required)
    summary: { type: String, required: true },
    // Detailed description of the project (required)
    description: { type: String, required: true },
    // URL for the project image (optional)
    image: { type: String, required: false },
    // URL for the project link (optional)
    link: { type: String, required: false },
    // Array of tag IDs associated with the project (optional, default is empty)
    tags: { type: [{ type: Schema.Types.ObjectId, ref: 'Tags' }], required: false, default: [] },
});

// Define a virtual property to get the tag names associated with the project
projectsSchema.virtual('tagNames').get(function () {
    // If there are no tags, return an empty array
    if (!this.tags) return [];
    // Return an array of tag names
    return this.tags.map(tag => tag.name);
});

// Create Project model from the projects schema
const Project = mongoose.model('Projects', projectsSchema);

// Function to validate the project input using Joi
const validateProject = (project) => {
    // Define a schema for validating the project
    const schema = Joi.object({
        // Title of a project (required)
        title: Joi.string().required(),
        // Summary of a project (required)
        summary: Joi.string().required(),
        // Description of a project (required)
        description: Joi.string().required(),
        // Image of a project (optional)
        image: Joi.string().optional(),
        // Link to a project (optional)
        link: Joi.string().optional(),
        // Tags of a project supplied as an array of stings (optional)
        tags: Joi.array().items(Joi.string()).optional()
    });
    // Validate the project using Joi
    return schema.validate(project);
}

// Export the Project model and validation function
module.exports = {Project, validateProject};