/*
Version: 1.5
Last edited by: Natalia Pakhomova
Last edit date: 7/05/2023

Main application file for the Portfolio API server
*/

// Import the Express framework
const express = require("express") 
 // Import the Mongoose library for working with MongoDB databases
const mongoose = require("mongoose")
 // Import the CORS library for enabling cross-origin resource sharing
const cors = require("cors")
 // Import the body-parser library for parsing HTTP request bodies
const bodyParser = require("body-parser")
// Import the Winston logging library for logging application events
const { createLogger, transports, format } = require("winston"); 
// Destructure some formatting functions from Winston for use in the logger configuration
const { combine, timestamp, label, printf } = format; 
// Import a Winston transport for logging to rotating files
const DailyRotateFile = require('winston-daily-rotate-file'); 
// Load environment variables from a .env file
require("dotenv").config(); 

// Import the application's API routes
const routes = require('./routes/routes'); 

// Create an instance of the Express application
const app = express(); 

// Set up middleware
app.use(express.json()); // Use the built-in JSON body parser
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse incoming JSON requests

// Serve static files from the 'public' directory at the '/public' route
app.use('/public', express.static('public')); 

// Create a new instance of the Winston logger with some custom configurations
const logger = createLogger({ 
  level: "info", // Log events with a severity level of 'info' or higher
  format: combine( // Apply multiple formatting functions to the log output
    label({ label: "api-server" }), // Add a label to the log output
    timestamp(), // Add a timestamp to the log output
    printf(({ level, message, label, timestamp }) => {
      return `${timestamp} [${label}] ${level}: ${message}`; // Customize the log output format
    })
  ),
  transports: [ // Configure where logs should be output
    new transports.Console(), // Log events to the console
    new DailyRotateFile({ // Log events to a rotating file
      filename: 'logs/%DATE%.log', // The pattern for the log file name
      datePattern: 'YYYY-MM-DD', // The pattern for the date in the log file name
      zippedArchive: true, // Archive log files after they've been compressed
      maxSize: '20m', // The maximum size of each log file in MB
      maxFiles: '14d' // The maximum number of log files to keep before deleting the oldest ones
    })
  ],
});

// Add a middleware function to the application that logs all incoming requests
app.use((req, res, next) => { 
  logger.info(`${req.method} ${req.originalUrl}`); // Log the request method and URL
  next(); // Call the next middleware function in the stack
  logger.info(`${res.statusCode}`); // Log the response code
});

// Define the URI of the MongoDB server
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
// Define the name of the MongoDB database to connect to
const dbName = process.env.MONGODB_DBNAME || 'portfolio'; 

// Connect to the MongoDB server using Mongoose
mongoose.connect(dbUri, { // Set the URI of the MongoDB server
    useNewUrlParser: true, // Configure Mongoose to use the new URL parser
    useUnifiedTopology: true, // Configure Mongoose to use the new server discovery and monitoring engine
    dbName: dbName // Set the name of the MongoDB database
});

// Register the application's API routes
app.use('/api', routes); 

// Define the port that the application will listen on 
const appPort = process.env.PORT || 5000; 

// Start the server and listen for incoming requests
app.listen(appPort, () => { 
  console.log(`Server running on port ${appPort}`); // Log a message to indicate that the server is running
});
