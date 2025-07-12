const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => { // Declares an asynchronous function called connectDB that will connect to your MongoDB database.
  try {
    await mongoose.connect(process.env.MONGO_URI, { //Connects to MongoDB using the URI from .env.
      useNewUrlParser: true,//uses the new MongoDB connection string parser
      useUnifiedTopology: true //uses the new engine for server discovery and monitoring (improves stability).
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB; //Exports the function so you can import and call connectDB() in your index.js or other files.
