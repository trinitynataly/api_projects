/*
Version: 1.2
Last edited by: Natalia Pakhomova
Last edit date: 14/05/2023

Tags module controller, managing CRUD operations for Tags
*/

// Import the HTTP errors library for creating HTTP errors
const createError = require('http-errors');
// Import the helper function to extract fields from an object
const {extractFields, handleDBError} = require("../helpers/data");
// Import the helper for removing tag from all projects
const {removeTagFromProjects} = require('../helpers/tags');
// Import the Tag model
const {Tag, validateTag} = require('../models/tags');

// Export an async function to handle a GET (Read) request to retrieve all tags from the database
exports.getTags = async (req, res, next) => {
    try {
        // Find all tags in the database
        const tags = await Tag.find({});
        // Return the tags in the response
        res.json(tags);
    } catch (error) { // Catch any errors that might occur
        // If there was an error return the error message
        handleDBError(res, error, next);
    }
};

// Export an async function to handle a GET (Read) request to retrieve a specific tag from the database
exports.getTag = async (req, res, next) => {
    try {
        // Find the tag with the specified ID
        const tag = await Tag.findById(req.params.id);
        // Check if the tag exists
        if (!tag) {
            // If not, return a 404 error with an error message
            throw createError(404, 'Tag not found!');
        }
        // Return the tag in the response
        res.json(tag);
    } catch (error) { // Catch any errors that might occur
        // If there was an error return the error message
        handleDBError(res, error, next);
    }
};

// Export an async function to handle a POST (Create) request to add a new tag to the database
exports.createTag = async (req, res, next) => {
    try {
        // Extract the tag data from the request body object
        const tagData = extractFields(req.body, ['name'], '');
        // Validate the tag data using Joi
        const {error} = validateTag(tagData);
        // If the validation fails, return a 400 (Bad Request) error with the error message
        if (error) throw createError(400, error.details[0].message);
        // Create a new tag with the extracted name
        const tag = new Tag(tagData);
        // Save the tag to the database
        const savedTag = await tag.save();
        // Return the saved tag in the response
        res.json(savedTag);
    } catch (error) { // Catch any errors that might occur
        // Check if the error is a MongoDB duplicate key error
        if (error.code && error.code === 11000) {
            // If so, return a 400 error with an error message that the tag name must be unique
            next(createError(400, 'A tag with the same name already exists!'));
        } else {
            // If there was an error return the error message
            handleDBError(res, error, next);
        }
    }
};

// Export an async function to handle a PUT (Update) request to update a specific tag in the database
exports.updateTag = async (req, res, next) => {
    try {
        // Extract the tag data from the request body object
        const tagData = extractFields(req.body, ['name'], '');
        // Validate the tag data using Joi
        const {error} = validateTag(tagData);
        // If the validation fails, return a 400 (Bad Request) error with the error message
        if (error) throw createError(400, error.details[0].message);
        // Find the tag with the specified ID
        const tag = await Tag.findById(req.params.id);
        // Check if the tag exists
        if (!tag) {
            // If not, return a 404 error with an error message
            throw createError(404, 'Tag not found!');
        }
        // Check if the tag name is the same as the name in the request body
        if (tag.name !== tagData.name) {
            // Update tag with the new name
            tag.name = tagData.name;
            // Save the updated tag to the database
            await tag.save();
        }
        // Return the updated tag in the response
        res.json(tag);
    } catch (error) { // Catch any errors that might occur
        // Check if the error is a MongoDB duplicate key error
        if (error.code && error.code === 11000) {
            // If so, return a 400 error with an error message that the tag name must be unique
            next(createError(400, 'A tag with the same name already exists!'));
        } else {
            // If there was an error return the error message
            handleDBError(res, error, next);
        }
    }
};

// Export an async function to handle a DELETE (Delete) request to delete a specific tag from the database
exports.deleteTag = async (req, res, next) => {
    try {
        // Find the tag with the specified ID
        const tag = await Tag.findById(req.params.id);
        // Check if the tag exists
        if (!tag) {
            // If not, return a 404 error with an error message
            throw createError(404, 'Tag not found!');
        }
        // Remove the tag from all projects that it is linked to
        await removeTagFromProjects(tag._id);
        // Delete the tag
        await tag.deleteOne();
        // Return a success message in the response
        res.json({"message": "Tag deleted successfully!"});
    } catch (error) { // Catch any errors that might occur
        // If there was an error return the error message
        handleDBError(res, error, next);
    }
};