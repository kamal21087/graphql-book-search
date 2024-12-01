import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the MongoDB connection URI from environment variables
const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI) {
  console.error('Error: MongoDB URI not set in .env file');
  process.exit(1);
}

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI).then(
  () => {
    console.log('MongoDB connection successful.');
  },
  (err) => {
    console.error('MongoDB connection error:', err);
  }
);

const db = mongoose.connection;

// Export the database connection for use in other files
export default db;
