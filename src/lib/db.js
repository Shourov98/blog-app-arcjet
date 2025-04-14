// lib/db.js or wherever your connection file is
import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return; // If already connected, return
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      code: error.code
    });
    throw error; // Let the error be handled by the caller
  }
};

export default connectToDatabase;
