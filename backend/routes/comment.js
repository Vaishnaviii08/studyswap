const express = require('express');
const router = express.Router();
const {addComment, editComment, deleteComment, fetchComments} = require('../controllers/commentController');
const auth = require('../middleware/auth');

//Route to add comment
router.post('/add', auth, addComment);

//Route to edit comment
router.patch('/edit', auth, editComment);

//Route to delete comment
router.delete('/delete', auth, deleteComment);

//Route to get all comments for a resource
router.get('/:resourceId', fetchComments);

module.exports = router;