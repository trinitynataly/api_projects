/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 14/05/2023

Helper functions for data manipulation
*/

// Import the Mongoose library
const mongoose = require('mongoose');
// Import the HTTP errors library for creating HTTP errors
const createError = require('http-errors');

// Helper function to extract fields from an object and return a new object with only the extracted fields
const extractFields = (obj, fields, defaultValue = null) => {
        // Return the fields extracted from the object
    return fields.reduce((acc, field) => {

        // Check if the object has the field
        if (obj.hasOwnProperty(field)) {
            // if yes, add the field to the accumulator object
            acc[field] = obj[field];
        } else {
            // if no, add the field to the accumulator object with the default value it is not null
            if (defaultValue !== null) {
                acc[field] = defaultValue;
            }
        }
        // Return the accumulator object
        return acc;
    }, {});
}

// Helper function to hande db-related try-catch errors
const handleError = (res, error, next) => {
    // Check if error message is DB connection related
    if (error.message.includes('buffering timed out') || error.message.includes('ECONNREFUSED')) {
        // If yes, return a custom error for timeout
        next(createError(504, 'Database operation timed out. Please try again later.'));
    }
    // Check if error message is DB validation related
    else if (error instanceof mongoose.Error.CastError) {
        // If yes, return a 400 error with a generic error message
        next(createError(400, 'Invalid resource ID'));
    } else {
        // If no, return the error with the status code and message
        const statusCode = error.statusCode || 400;
        const errorMessage = error.message || 'Invalid request. Please try again.';
        next(createError(statusCode, errorMessage));
    }
}

module.exports = {extractFields, handleDBError: handleError};
