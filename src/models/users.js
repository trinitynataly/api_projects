/*
Version: 1.4
Last edited by: Natalia Pakhomova
Last edit date: 7/05/2023

User Schema for storing Users in database
*/

// Import the Mongoose library
const mongoose = require('mongoose');
// Destructure the Schema class from Mongoose
const { Schema } = mongoose;

// Define the user schema for Users collection
const userSchema = new Schema({
  // User's name (required)
  name: { type: String, required: true },
  // User's email address (required, unique, case insensitive, indexed)
  email: {
    type: String,
    required: true,
    unique: true, // Each email must be unique
    lowercase: true, // Convert email to lowercase before saving to the database
    index: true // Add an index to the email field for faster queries
  },
  // User's password hash (required)
  password: { type: String, required: true },
  // Date when the user was created (required, auto-generated)
  createdAt: { type: Date, default: Date.now }
}, {
  collation: { locale: 'en_US', strength: 2 } // Use the en_US collation with strength of 2 for case-insensitive search
});

// Pre-save hook to convert email to lowercase
userSchema.pre('save', function (next) {
  if (this.isModified('email')) {
    // Convert the email to lowercase
    this.email = this.email.toLowerCase();
  }
  next();
});

// Export the user model using the userSchema definition
module.exports = mongoose.model('Users', userSchema);
