const express = require('express');
const { getCurrentUser, getUserById, getLeaderboard } = require('../controllers/userController');
const auth = require('../middleware/auth'); // JWT middleware

const router = express.Router();

// GET /users/me - Returns logged-in user info
router.get('/me', auth, getCurrentUser);

//Leaderboard route
router.get('/leaderboard', getLeaderboard);

// Public profile route
router.get('/:id', getUserById); // No auth middleware needed

module.exports = router;