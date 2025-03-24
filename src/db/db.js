const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Add database name to the connection string if not present
    const uri = process.env.MONGODB_URI.includes('clubllm') 
      ? process.env.MONGODB_URI 
      : `${process.env.MONGODB_URI.split('?')[0]}/clubllm?${process.env.MONGODB_URI.split('?')[1]}`;
    
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 