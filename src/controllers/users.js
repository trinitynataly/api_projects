/*
Version: 1.5
Last edited by: Natalia Pakhomova
Last edit date: 14/05/2023

Users module controller, managing CRUD operations for Users
*/

// Import the HTTP errors library for creating HTTP errors
const createError = require('http-errors');
// Import the helper function to extract fields from an object
const {extractFields, handleDBError} = require("../helpers/data");
// Import the helper function to encrypt passwords
const {encryptPassword} = require('../helpers/auth');
// Import the User model and Joi validation schema
const {User, validateUser} = require('../models/users');


// Export an async function to handle a GET (Read) request to retrieve all users from the database
exports.getUsers = async (req, res, next) => {
    try {
        // Find all users in the database and exclude the password field
        const users = await User.find({}).select('-password');
        // Return the users in the response
        res.json(users);
    } catch (error) { // Catch any errors that might occur
        // If there was an error return the error message
        handleDBError(res, error, next);
    }
};

// Export an async function to handle a GET (Read) request to retrieve a specific user from the database
exports.getUser = async (req, res, next) => {
    try {
        // Find the user with the specified ID and exclude the password field
        const user = await User.findById(req.params.id).select('-password');
        // Check if the user exists
        if (!user) {
            // If not, return a 404 error with an error message
            throw createError(404, 'User not found!');
        }
        // Return the user in the response
        res.json(user);
    } catch (error) { // Catch any errors that might occur
        // If there was an error return the error message
        handleDBError(res, error, next);
    }
};

// Export an async function to handle a POST (Create) request to add a new user to the database
exports.createUser = async (req, res, next) => {
    try {
        // Extract the user details from the request body, force empty strings for missing fields
        const userData = extractFields(req.body, ['name', 'email', 'password'], '');
        // Validate the user details using Joi
        const {error} = validateUser(userData, true);
        // If the validation fails, return a 400 (Bad Request) error with the error message
        if (error) throw createError(400, error.details[0].message);
        // Encrypt the password
        userData.password = await encryptPassword(userData.password);
        // Create a new user with the name, email, and hashed password
        const user = new User(userData);
        // Save the user to the database
        const savedUser = await user.save();
        // Convert the savedUser object to a plain JavaScript object
        const userResponse = savedUser.toObject();
        // Delete the password field from the returned user object
        delete userResponse.password;
        // Return the user in the response
        return res.json(userResponse);
    } catch (error) { // Catch any errors that might occur
        // Check if the error is a MongoDB duplicate key error
        if (error.code && error.code === 11000) {
            // If so, return a 400 error with an error message that the email must be unique
            next(createError(400, 'A user with the same email already exists!'));
        } else {
            // If there was an error return the error message
            handleDBError(res, error, next);
        }
    }
};

// Export an async function to handle a PUT (Update) request to update a specific user in the database
exports.updateUser = async (req, res, next) => {
    try {
        // Extract the user details from the request body, force empty strings for missing fields
        const userData = extractFields(req.body, ['name', 'email', 'password']);
        // Validate the user details using Joi
        const {error} = validateUser(userData);
        // If the validation fails, return a 400 (Bad Request) error with the error message
        if (error) throw createError(400, error.details[0].message);
        // Check if the password is supplied
        if (userData.password) {
            // Encrypt the password
            userData.password = await encryptPassword(userData.password);
        }
        // Find the user with the specified ID and update it with the updates object
        const user = await User.findByIdAndUpdate(req.params.id, userData, {
            new: true, // Return the updated user
            runValidators: true // Validate the data before updating
        });
        // Check if the user exists
        if (!user) {
            // If not, return a 404 error with an error message
            throw createError(404, 'User not found!');
        }
        // Convert the user object to a plain JavaScript object
        const userResponse = user.toObject();
        // Delete the password field from the returned user object
        delete userResponse.password;
        // Return the user in the response
        return res.json(userResponse);
    } catch (error) { // Catch any errors that might occur
        // Check if the error is a MongoDB duplicate key error
        if (error.code && error.code === 11000) {
            // If so, return a 400 error with an error message that the email must be unique
            next(createError(400, 'A user with the same email already exists!'));
        } else {
            // If there was an error return the error message
            handleDBError(res, error, next);
        }
    }
};

// Export an async function to handle a DELETE (Delete) request to delete a specific user from the database
exports.deleteUser = async (req, res, next) => {
    try {
        // Find the user with the specified ID and delete it from the database
        const user = await User.findByIdAndDelete(req.params.id);
        // Check if the user exists
        if (!user) {
            // If not, return a 404 error with an error message
            throw createError(404, 'User not found!');
        }
        // Return a success message
        res.json({"message": "User deleted successfully!"});
    } catch (error) { // Catch any errors that might occur
        // If there was an error return the error message
        handleDBError(res, error, next);
    }
};
