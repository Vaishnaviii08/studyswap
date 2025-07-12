const mongoose = require("mongoose");
const { Schema } = mongoose;

const voteSchema = new mongoose.Schema({
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
  voteType: {
    type: String,
    enum: ["up", "down"],
    required: true,
  },
  votedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Prevent duplicate vote by same user on same resource
voteSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);
