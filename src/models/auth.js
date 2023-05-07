/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 7/05/2023

RefreshToken Schema for storing JWT tokens in database
*/

// Import the Mongoose library
const mongoose = require('mongoose');

// Define a Mongoose schema for the refresh tokens
const refreshTokenSchema = new mongoose.Schema({
  // Reference to the Users collection and the user the token belongs to
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  // The refresh token string
  token: { type: String, required: true },
  // The timestamp for when the token expires
  expiresAt: { type: Date, required: true }
});

// Create an index on the expiresAt field for automatic deletion of expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Export the Mongoose model for the refresh tokens
module.exports = mongoose.model('RefreshToken', refreshTokenSchema);