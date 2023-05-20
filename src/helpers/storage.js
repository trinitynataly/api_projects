/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 14/05/2023

Helper function for file uploads
*/


// Import the multer middleware to handle file uploads
const multer = require('multer');
// Import the path module to extract file extensions
const path = require('path');

// Define a function to generate a unique ID
const generateId = () => {
    // Generate a random integer between 0 and 99999
    const randNum = Math.floor(Math.random() * 100000);
    // Get the current timestamp in milliseconds
    const timestamp = new Date().getTime();
    // Combine the random integer and timestamp to create a unique ID
    return `${randNum}${timestamp}`;
};

// Set up multer to store uploaded image files in the './public/projects' directory
const projectStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/projects');
    }, filename: function (req, file, cb) {
        // Generate a unique filename for the uploaded file
        const ext = path.extname(file.originalname);
        // Call the callback function passing the unique filename
        const uniqueFilename = `${file.fieldname}-${generateId()}${ext}`;
        // Store the unique filename in the req object
        cb(null, uniqueFilename);
    }
});

// Create an instance of the multer middleware using the storage options
const uploadProjectImage = multer({storage: projectStorage});

// Export the uploadProjectImage helper function
module.exports = {uploadProjectImage};
