// models/Download.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const downloadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resource",
    required: true,
  },
  downloadDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Download", downloadSchema);
