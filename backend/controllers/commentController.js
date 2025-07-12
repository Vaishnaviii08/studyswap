const Comment = require("../models/Comment");
const User = require("../models/User");
const Resource = require("../models/Resource");

//To add a comment
const addComment = async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findById(req.userId);
    if (!user) {
      console.log("User not found:", req.userId);
      return res.status(400).json({
        success: false,
        error: "User not found",
      });
    }

    const { resourceId, content, parentCommentId } = req.body;

    // Check if file was uploaded
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      console.log("Resource not found:", resourceId);
      return res.status(400).json({
        success: false,
        error: "Resource not found",
      });
    }

    const newComment = new Comment({
      userId: req.userId,
      resourceId,
      content,
      parentCommentId,
    });

    await newComment.save();

    res.status(201).json({
      message: "Comment Added successfully",
      comment: {
        id: newComment.userId,
        resourceId: newComment.username,
        content: newComment.content,
        parentCommentId: newComment.parentCommentId,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Cannot add comment" });
  }
};

//To edit a comment
const editComment = async (req, res) => {
  try {
    const { commentId, content } = req.body;

    // Check if user exists
    const user = await User.findById(req.userId);
    if (!user) {
      console.log("User not found:", req.userId);
      return res.status(400).json({
        success: false,
        error: "User not found",
      });
    }

    //Check if comment exists
    const commentToUpdate = await Comment.findById(commentId);
    if (!commentToUpdate) {
      console.log("Comment not found:", commentId);
      return res.status(400).json({
        success: false,
        error: "Comment not found",
      });
    }

    //Update the comment
    const updated = await Comment.findByIdAndUpdate(
      commentId,
      { $set: { content } },
      { new: true }
    );

    res.status(201).json({
      message: "Comment edited successfully",
      comment: {
        id: updated.userId,
        resourceId: updated.username,
        content: updated.content,
        parentCommentId: updated.parentCommentId,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Cannot edit comment" });
  }
};

//To delete a comment
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.body;

    // Check if user exists
    const user = await User.findById(req.userId);
    if (!user) {
      console.log("User not found:", req.userId);
      return res.status(400).json({
        success: false,
        error: "User not found",
      });
    }

    //Check if comment exists
    const commentToUpdate = await Comment.findById(commentId);
    if (!commentToUpdate) {
      console.log("Comment not found:", commentId);
      return res.status(400).json({
        success: false,
        error: "Comment not found",
      });
    }

    //Update the comment
    const deleted = await Comment.findByIdAndDelete(commentId);

    res.status(201).json({
      message: "Comment deleted successfully",
      comment: {
        id: deleted.userId,
        resourceId: deleted.username,
        content: deleted.content,
        parentCommentId: deleted.parentCommentId,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Cannot delete comment" });
  }
};

//To fetch all comments of a resource
const fetchComments = async (req, res) => {
  try {
    const { resourceId } = req.params;

    //Find all the comments of a resource
    const comments = await Comment.find({ resourceId }).lean(); //.lean() is a Mongoose query modifier that tells Mongoose to return plain JavaScript objects instead of full Mongoose documents.

    // Group by parentCommentId to build nested tree
    const commentMap = {};
    comments.forEach((comment) => {
      comment.replies = [];
      commentMap[comment._id] = comment;
    });
    
    const rootComments = [];
    comments.forEach((comment) => {
      if (comment.parentCommentId) {
        commentMap[comment.parentCommentId]?.replies.push(comment);
      } else {
        rootComments.push(comment);
      }
    });

    res.status(201).json({
      message: "Comments fetched successfully",
      rootComments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Cannot fetch comments" });
  }
};

module.exports = { addComment, editComment, deleteComment, fetchComments };
