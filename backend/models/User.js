const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true }, //Display name of the user
  email:    { type: String, required: true, unique: true }, //Used for login, must be unique
  password: { type: String, required: true }, //Hashed password using bcrypt for security
  reputationPoints: { type: Number, default: 0 }, //Reputation based on upvotes, uploads, etc.
  downloadCredits:  { type: Number, default: 5 }, //Number of downloads a user can make
  uploadsCount:     { type: Number, default: 0 }, //Number of resources the user has uploaded
  downloadsCount:   { type: Number, default: 0 }, //Total number of downloads performed by the user
  badges:           { type: [String], default: [] }, //Achievement-based labels
}, { timestamps: true }); //Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('User', UserSchema);
