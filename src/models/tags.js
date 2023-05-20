/*
Version: 1.2
Last edited by: Natalia Pakhomova
Last edit date: 14/05/2023

Tag Schema for storing Tags in database
*/

// Import the Mongoose library
const mongoose = require('mongoose');
// Import the Joi library for validating schemas
const Joi = require('joi');
// Destructure the Schema class from Mongoose
const {Schema} = mongoose;

// Define the schema for the Tags collection
const tagsSchema = new Schema({
    name: {type: String, required: true},
});

// Create an index on the name field for case-insensitive sorting
tagsSchema.index(
    {
        name: 1,
    },
    {
        unique: true,
        collation: {
            locale: 'en_US',
            strength: 1,
        },
    }
);

// Create a Tag model from the tag schema
const Tag = mongoose.model('Tags', tagsSchema);


// Function to validate the tag input using Joi
const validateTag = (tag) => {
    // Define a schema for validating the tag
    const schema = Joi.object({
        // Name of a tag (required)
        name: Joi.string().required()
    });
    // Validate the login using Joi
    return schema.validate(tag);
}

// Export the Tag model and Joi schema
module.exports = {Tag, validateTag};