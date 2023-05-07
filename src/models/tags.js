/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 7/05/2023

Tag Schema for storing Tags in database
*/

// Import the Mongoose library
const mongoose = require('mongoose');
// Destructure the Schema class from Mongoose
const { Schema } = mongoose;

// Define the schema for the Tags collection
const tagsSchema = new Schema({
    // Name of a tag (required)
    name: { type: String, required: true }
});

// Define an index for the name field
tagsSchema.index({
    name: 1 // Sort by name in ascending order
}, {
    unique: true, // Ensure that each tag name is unique
    collation: { // Define a collation to specify case insensitivity
        locale: 'en_US',
        strength: 1
    }
});

// Export the Tags model using the tagsSchema definition
module.exports = mongoose.model('Tags', tagsSchema);
