const express = require('express')
const app = express()
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
require('dotenv').config(); // Load .env values into process.env

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const resourceRoutes = require('./routes/resources');
const voteRoutes = require("./routes/votes");
const commentRoutes = require('./routes/comment');

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173',
  'https://your-frontend.vercel.app'],
  credentials: true
})); 
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use("/resources", resourceRoutes);
app.use("/votes", voteRoutes);
app.use("/comment", commentRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Example app listening at: http://localhost:${PORT}`)
})