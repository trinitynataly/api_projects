/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 7/05/2023

Project Schema for storing Projects in database
*/

// Import the Mongoose library
const mongoose = require('mongoose');
// Destructure the Schema object from the Mongoose library
const { Schema } = mongoose;

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
  // Return an array of tag names
  return this.tags.map(tag => tag.name);
});

// Export the Projects model using the projectsSchema definition
module.exports = mongoose.model('Projects', projectsSchema);
