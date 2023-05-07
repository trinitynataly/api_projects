# Portfolio API Server

This is a Node.js application that serves as a server for a portfolio website's API. It uses the Express framework for routing, Mongoose for working with MongoDB databases, CORS for enabling cross-origin resource sharing, body-parser for parsing HTTP request bodies, and Winston for logging application events.

## Requirements

- Node.js
- MongoDB

## Installation

1. Clone the repository.
2. Run `npm install` to install the project's dependencies.

## Configuration

1. Create a `.env` file in the project's root directory.
2. Set the `MONGODB_URI` environment variable to the URI of your MongoDB server.
3. Set the `MONGODB_DBNAME` environment variable to the name of the MongoDB database to connect to.
4. Set the `PORT` environment variable to the port number that the application should listen on.
5. Set the `JWT_SECRET` environment variable to the secret key for generating JSON Web Tokens (JWTs)
6. Set the `JWT_REFRESH_SECRET` environment variable to the secret key for generating JWT refresh tokensnode src/app.js

## Usage

1. Run `node src/app.js` to start the application.
2. The server will be accessible at `http://localhost:<port>/api`.

## Project Structure

The project's main file is located at `src/app.js`. This file contains the application's middleware, routes, and logging configuration. The API routes are defined in `src/routes/routes.js`. Static files such as images, stylesheets, and JavaScript files are located in the `public` directory.

