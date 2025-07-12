const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config(); // Load .env values into process.env

//Signup
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  //Checks for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Send the array of error messages back
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //Check if user with the same email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //Creating a secure password by addind salt and hashing it
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    //Create user
    const user = await User.create({ username, email, password: hashedPass });

    //Returning a jwt token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    //Returning success message
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

//Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  //Checks for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Send the array of error messages back
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    //Checking if password is matching
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    //Getting jwt token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    //Returning success message
    res.status(201).json({
      message: 'User logged in successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token
    });

  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

module.exports = { registerUser, loginUser };
