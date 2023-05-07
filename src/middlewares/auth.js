/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 7/05/2023

Middleware for JWT token validation
*/

// Import the JSON Web Token library for working with authentication tokens
const jwt = require('jsonwebtoken'); 

// Define a middleware function for authenticating requests with a JWT
const authenticateToken = (req, res, next) => { 
  // Get the value of the 'Authorization' header from the incoming request
  const authHeader = req.headers['authorization']; 
  // Extract the JWT from the 'Authorization' header
  const token = authHeader && authHeader.split(' ')[1]; 
  
  // Check if token had been supplied
  if (!token) { 
    // If no token was found, return an error response
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Verify the authenticity of the JWT using the JWT_SECRET environment variable
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { 
    if (err) { // If the JWT is invalid, return an error response
      return res.status(403).json({ error: 'Invalid token' });
    }

     // If the JWT is valid, decode its payload and attach it to the request object for use by downstream middleware and routes
    req.user = decoded;
    // Call the next middleware function in the stack
    next(); 
  });
};

module.exports = authenticateToken; // Export the middleware function for use in other modules