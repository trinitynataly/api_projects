/*
Version: 1.6
Last edited by: Natalia Pakhomova
Last edit date: 14/05/2023

Main application file for the Portfolio API server
*/

// Import the Express framework
const express = require("express")
// Import the Helmet library for securing HTTP headers
const helmet = require("helmet");
// Import the Mongoose library for working with MongoDB databases
const mongoose = require("mongoose")
// Import the CORS library for enabling cross-origin resource sharing
const cors = require("cors")
// Import the body-parser library for parsing HTTP request bodies
const bodyParser = require("body-parser")
// Import the Winston logging library for logging application events
const {createLogger, transports, format} = require("winston");
// Destructure some formatting functions from Winston for use in the logger configuration
const {combine, timestamp, label, printf} = format;
// Import a Winston transport for logging to rotating files
const DailyRotateFile = require('winston-daily-rotate-file');
// Import the HTTP errors library for creating HTTP errors
const createError = require('http-errors');
// Import the application's API routes
const routes = require('./routes/routes');
// Load environment variables from a .env file
require("dotenv").config();

// Setup helmet module settings
const helmetSettings = {
    contentSecurityPolicy: { // Enable the Content Security Policy middleware
        directives: { // Set the directives for the Content Security Policy
            defaultSrc: ["'self'"], // Allow resources to be loaded from the same origin
            styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles and loaded styles from the same origin
        },
    },
};

// Create a new instance of the Winston logger with some custom configurations
const logger = createLogger({
    level: "info", // Log events with a severity level of 'info' or higher
    format: combine( // Apply multiple formatting functions to the log output
        label({label: "api-server"}), // Add a label to the log output
        timestamp(), // Add a timestamp to the log output
        printf(({level, message, label, timestamp}) => {
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

// Define the URI of the MongoDB server
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
// Define the name of the MongoDB database to connect to
const dbName = process.env.MONGODB_DBNAME || 'portfolio';
// Define the port that the application will listen on
const appPort = process.env.PORT || 5000;

// Connect to the MongoDB server using Mongoose
const mongooseOptions = {
    useNewUrlParser: true, // Configure Mongoose to use the new URL parser
    useUnifiedTopology: true, // Configure Mongoose to use the new server discovery and monitoring engine
    dbName: dbName // Set the name of the MongoDB database
};

// Function to establish a connection to MongoDB
const connect = () => {
    mongoose.connect(dbUri, mongooseOptions)
        .then(() => {
            logger.info('Connected to MongoDB'); // Log the error
        })
        .catch(error => {
            logger.error('Error connecting to MongoDB:', error);
        });
};

// Call the connect function to establish the initial connection
connect();

// Handle MongoDB connection events
mongoose.connection.on('connected', function () {
    logger.info('Mongoose default connection open to ' + dbUri);
});


// Handle MongoDB connection error events
mongoose.connection.on('error', error => {
    logger.error('MongoDB connection error:', error);
});

// Handle MongoDB disconnection events
mongoose.connection.on('disconnected', () => {
    logger.error('MongoDB disconnected');

});

// Handle MongoDB reconnection failure events
mongoose.connection.on('reconnectFailed', () => {
    logger.error('MongoDB reconnection failed');
    // Implement your error handling or recovery mechanism here
    // This can include logging, sending alerts, or taking corrective actions
});

// Function to gracefully disconnect from MongoDB
const disconnect = () => {
    mongoose.connection.close(() => {
        logger.info('Disconnected from MongoDB');
        // Implement any cleanup or additional tasks before closing the application
        process.exit(0);
    });
};

// Gracefully handle application termination
process.on('SIGINT', () => {
    disconnect();
});

// Create an instance of the Express application
const app = express();

// Set up middleware
app.use(helmet(helmetSettings)); // Use the helmet middleware with the specified settings
app.use(express.json()); // Use the built-in JSON body parser
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse incoming JSON requests
// Serve static files from the 'public' directory at the '/public' route
app.use('/public', express.static('public'));
// Add a middleware function to the application that logs all incoming requests
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`); // Log the request method and URL
    next(); // Call the next middleware function in the stack
});
// Register the application's API routes
app.use('/api', routes);
// Error handling middleware for 404 (Not Found) errors
app.use((req, res, next) => {
    next(createError(404, 'Resource not found or method not supported'));
});
// Error handling middleware for all other errors
app.use((err, req, res, next) => {
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`); // Log the error
    res.status(err.status || 500); // Set the response status code
    res.json({ // Send a JSON response
        error: {
            status: err.status || 500,
            message: err.message
        }
    });
});
// Start the server and listen for incoming requests
app.listen(appPort, () => {
    console.log(`Server running on port ${appPort}`); // Log a message to indicate that the server is running
});
