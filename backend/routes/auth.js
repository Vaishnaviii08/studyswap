const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const {body} = require('express-validator');
const router = express.Router();

router.post('/register',[
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
], registerUser);

router.post('/login', [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
], loginUser);

module.exports = router;