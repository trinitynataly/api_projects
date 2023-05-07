/*
Version: 1.4
Last edited by: Natalia Pakhomova
Last edit date: 7/05/2023

Users module controller, managing CRUD operations for Users
*/

// Import the bcrypt module for hashing passwords
const bcrypt = require('bcrypt');
// Import the User model
const User = require('../models/users');


// Export an async function to handle a GET (Read) request to retrieve all users from the database
exports.getUsers = async (req, res) => {
    try {
        // Find all users in the database and exclude the password field
        const users = await User.find({}).select('-password');
        // Return the users in the response
        res.json(users);
    } catch (error) { // Catch any errors that might occur
        // Return a 400 error with the error message
        res.status(400).json({error: error.message});
    }
};

// Export an async function to handle a POST (Create) request to add a new user to the database
exports.createUser = async (req, res) => {
    // Extract the name, email, and password from the request body object
    const {name, email, password} = req.body;
    // Check if the name, email, and password are missing
    if (!name || !email || !password) {
        // If so, return a 400 error with an error message
        return res.status(400).json({error: "Name, email, and password are required!"});
    }

    // Check if the name is the same as the password
    if (name === password) {
        // If so, return a 400 error with an error message
        return res.status(400).json({error: 'Name cannot be the same as password!'});
    }
    // Check if the password is less than 6 characters long or does not contain at least one letter and one number
    if (password.length < 6 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
        // If so, return a 400 error with an error message
        return res.status(400).json({error: 'Password must be at least 6 characters long and contain at least one letter and one number!'});
    }
    // Check if the email is a valid email address
    if (!/\S+@\S+\.\S+/.test(email)) {
        // If so, return a 400 error with an error message
        return res.status(400).json({error: 'Email must be a valid email address!'});
    }

    // Set the number of salt rounds
    const saltRounds = 10;
    // Generate a salt and use it to hash the password
    const salt = await bcrypt.genSalt(saltRounds);
    // Get the hashed password from the password + salt combination
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        // Create a new user with the name, email, and hashed password
        const user = new User({
            name: name, // User name
            email: email, // User email address
            password: hashedPassword // Hashed password
        });
        // Save the user to the database
        const savedUser = await user.save();
        // Convert the savedUser object to a plain JavaScript object
        const userResponse = savedUser.toObject();
        // Delete the password field from the returned user object
        delete userResponse.password;
        // Return the user in the response
        return res.json(userResponse);
    } catch (error) { // Catch any errors that might occur
        // Return a 400 error with the error message
        res.status(400).json({error: error.message});
    }
};

// Export an async function to handle a GET (Read) request to retrieve a specific user from the database
exports.getUser = async (req, res) => {
    try {
        // Find the user with the specified ID and exclude the password field
        const user = await User.findById(req.params.id).select('-password');
        // Return the user in the response
        res.json(user);
    } catch (error) { // Catch any errors that might occur
        // Return a 400 error with the error message
        res.status(400).json({error: error.message});
    }
};


// Export an async function to handle a PUT (Update) request to update a specific user in the database
exports.updateUser = async (req, res) => {

    // Define the list of allowed fields
    const allowedFields = ['name', 'email', 'password'];

    // Create an empty object to store the updates
    const updates = {};

    // Loop through the allowed fields and check if the request body contains any of them
    for (const field of allowedFields) {
        // If so, add the field and value to the updates object
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    }

    // Check if the updates object is empty
    if (!updates) {
        // If so, return a 400 error with an error message
        return res.status(400).json({error: 'No fields provided for update!'});
    }

    // Check if the name and password are supplied and are the same
    if (updates.name && updates.password && updates.name === updates.password) {
        // If so, return a 400 error with an error message
        return res.status(400).json({error: 'Name cannot be the same as password!'});
    }

    // Check if the password is supplied and is less than 6 characters long or does not contain at least one letter and one number
    if (updates.password && (updates.password.length < 6 || !/\d/.test(updates.password) || !/[a-zA-Z]/.test(updates.password))) {
        // If so, return a 400 error with an error message
        return res.status(400).json({error: 'Password must be at least 6 characters long and contain at least one letter and one number!'});
    }

    // Check if the email is supplied and is a valid email address
    if (updates.email && !/\S+@\S+\.\S+/.test(updates.email)) {
        // If so, return a 400 error with an error message
        return res.status(400).json({error: 'Email must be a valid email address!'});
    }

    // Check if the password is supplied
    if (updates.password) {
        // Set the number of salt rounds
        const saltRounds = 10;
        // Generate a salt and use it to hash the password
        const salt = await bcrypt.genSalt(saltRounds);
        // Get the hashed password from the password + salt combination
        updates.password = await bcrypt.hash(updates.password, salt);
    }

    try {
        // Find the user with the specified ID and update it with the updates object
        const user = await User.findByIdAndUpdate(req.params.id, updates, {
            new: true, // Return the updated user
            runValidators: true // Validate the data before updating
        });
        // Check if the user exists
        if (!user) {
            // If not, return a 404 error with an error message
            return res.status(404).json({error: 'User not found'});
        }
        // Convert the user object to a plain JavaScript object
        const userResponse = user.toObject();
        // Delete the password field from the returned user object
        delete userResponse.password;
        // Return the user in the response
        return res.json(userResponse);
    } catch (error) { // Catch any errors that might occur
        // Return a 400 error with the error message
        res.status(400).json({error: error.message});
    }
};

// Export an async function to handle a DELETE (Delete) request to delete a specific user from the database
exports.deleteUser = async (req, res) => {
    try {
        // Find the user with the specified ID and delete it from the database
        const user = await User.findByIdAndDelete(req.params.id);
        // Check if the user exists
        if (!user) {
            // If not, return a 404 error with an error message
            return res.status(404).json({error: 'User not found'});
        }
        // Return a success message
        res.json({"message": "User deleted successfully!"});
    } catch (error) { // Catch any errors that might occur
        // Return a 400 error with the error message
        res.status(400).json({error: error.message});
    }
};
