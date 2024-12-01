//User.js

const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Create the User model, which will use the 'user' collection
const User = mongoose.model('User', userSchema, 'user'); // 'user' is the collection name

module.exports = User;
