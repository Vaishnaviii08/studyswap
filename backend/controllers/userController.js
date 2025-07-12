const User = require('../models/User');
const Resource = require('../models/Resource');

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userId = user._id;

    const uploadedResources = await Resource.find({uploaderUserId : userId});

    res.status(200).json({
      ...user.toObject(), // spread user fields
      uploadedResources,  // add resources to response
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('username reputationPoints uploadsCount downloadsCount createdAt');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const uploadedResources = await Resource.find({uploaderUserId : userId});

    res.status(201).json({
      message: "Fetched details successfully",
      user: {
        username: user.username,
        reputationPoints: user.reputationPoints,
        uploadsCount: user.uploadsCount,
        downloadsCount: user.downloadsCount,
        createdAt: user.createdAt,
        uploadedResources: uploadedResources
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({message : 'Server error', error : error.message});
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ reputationPoints: -1 })        // Sort by reputation descending
      .limit(5)                              // Only top 5
      .select("username reputationPoints badges uploadsCount downloadsCount");

    res.status(200).json({
      message: "Successfully fetched top 5 leaderboard",
      users: topUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Cannot fetch the leaderboard" });
  }
};

module.exports = { getCurrentUser, getUserById, getLeaderboard };
