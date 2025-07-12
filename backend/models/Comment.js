const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  userId : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  resourceId : {type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true},
  content: {type: String, required: true},
  parentCommentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null}
}, { timestamps: true }); //Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Comment', CommentSchema);