/*
Version: 1.5
Last edited by: Natalia Pakhomova
Last edit date: 14/05/2023

User Schema for storing Users in database
*/

// Import the Mongoose library
const mongoose = require('mongoose');
// Import the Joi library for validating schemas
const Joi = require('joi');
// Destructure the Schema class from Mongoose
const {Schema} = mongoose;

// Define the user schema for Users collection
const userSchema = new Schema({
    // Name of the user (required)
    name: {
        type: String, required: true, validate: {
            // Custom validator function to check if name is not equal to email or password
            validator: function (value) {
                // Name must not be equal to email or password
                return value !== this.email && value !== this.password;
            }, message: 'Name must not be equal to email or password',
        },
    }, // Email of the user (required, unique, lowercase, indexed)
    email: {
        type: String, required: true, unique: true, lowercase: true, index: true, validate: {
            // Custom validator function to check if email is valid
            validator: function (value) {
                // Use a regular expression to validate email format
                return /^\S+@\S+\.\S+$/.test(value);
            }, message: 'Invalid email address',
        },
    }, // Password of the user (required, encrypted)
    password: {
        type: String, required: true, validate: {
            // Custom validator function to check if password is valid
            validator: function (value) {
                // Password must be at least 6 characters long, containing at least one letter and one number
                return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(value);
            }, message: 'Password must be at least 6 characters long and contain at least one letter and one number',
        },
    }, // Timestamp for when the user was created (default is now)
    createdAt: {
        type: Date, default: Date.now,
    },
}, {
    // Case-insensitive sorting for name and email
    collation: {locale: 'en_US', strength: 2},
});


// Pre-save hook to convert email to lowercase
userSchema.pre('save', function (next) {
    // if email is modified
    if (this.isModified('email')) {
        // convert email to lowercase
        this.email = this.email.toLowerCase();
    }
    next();
});

// Create a User model from the user schema
const User = mongoose.model('Users', userSchema);

// Define a Joi schema for validating the user input
const validateUser = (user, isNewUser = false) => {
    // Define a schema for validating the user
    const schema = Joi.object({
        // Name of the user (required)
        name: Joi.string().required(),
        // Email of the user (required)
        email: Joi.string().email().required(),
        // Conditional password validation based on whether it's a new user or not
        password: isNewUser
            ? Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/).required()
            : Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/).optional()
    });
    // Validate the user using Joi
    return schema.validate(user);
}

// Define a Joi schema for validating the login input
const validateLogin = (login) => {
    // Define a schema for validating the login
    const schema = Joi.object({
        // Email of the user (required)
        email: Joi.string().email().required(),
        // Password of the user (required)
        password: Joi.string().required(),
    });
    // Validate the login using Joi
    return schema.validate(login);
}


module.exports = {User, validateUser, validateLogin};