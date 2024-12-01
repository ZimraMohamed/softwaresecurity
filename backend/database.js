// database.js

const mongoose = require('mongoose');

// MongoDB Atlas connection URI
const mongoURI = 'mongodb+srv://zimramohamed64:ey3Nhi5otrQTGJKQ@softwaresecurity-db.j24t4.mongodb.net/softwaresecurity?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

