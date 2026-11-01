const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance_app';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(` MongoDB Connection Warning: ${error.message}`);
    console.warn(' Running in database offline / fallback mode if MongoDB is not started.');
    isConnected = false;
  }
};

const getDbStatus = () => isConnected;

module.exports = { connectDB, getDbStatus };
