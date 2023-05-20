/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 14/05/2023

Helper functions for tags
*/

// Import the Tag model
const {Tag} = require("../models/tags");
// Import the Project model
const {Project} = require("../models/projects");


// Function to find or create tags from an array of tag names
const findOrCreateTags = async (tags) => {
    // Create an empty array to store tag IDs
    const tagIds = [];
    // Create an empty array to store tag names
    const tagNames = [];
    // If tags are provided and are an array, process them
    if (tags && Array.isArray(tags)) {
        // Loop through each tag in the 'tags' array
        for (const tag of tags) {
            // Check if the tag already exists in the Tags collection by name (case-insensitive)
            let existingTag = await Tag.findOne({name: {$regex: new RegExp('^' + tag + '$', 'i')}});
            // Check if the tag record was found
            if (!existingTag) {
                // If the tag doesn't exist, create a new one and save it
                existingTag = new Tag({name: tag});
                await existingTag.save();
            }
            // Push the tag ID and name to their respective arrays
            tagIds.push(existingTag._id);
            tagNames.push(existingTag.name);
        }
    }
    // Return the tag IDs and names as an object
    return {tagIds, tagNames};
}

const removeTagFromProjects = async (tagId) => {
    // Remove the tag from all projects
    await Project.updateMany({tags: tagId}, {$pull: {tags: tagId}});
}

// Export the helper function
module.exports = {findOrCreateTags, removeTagFromProjects};