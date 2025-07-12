const mongoose = require('mongoose');
const { Schema } = mongoose;

const resourceSchema = new Schema({
  uploaderUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  semester: { type: Number, required: true },

  tags: [{ type: String }],
  fileURL: { type: String, required: true },
  fileType: { type: String, required: true }, // e.g., "pdf", "docx", etc.

  upvotesCount: { type: Number, default: 0 },
  downloadsCount: { type: Number, default: 0 }
}, { timestamps: true }); // adds createdAt and updatedAt fields

module.exports = mongoose.model('Resource', resourceSchema);
