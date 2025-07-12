const Vote = require("../models/votes");
const Resource = require("../models/Resource");
const User = require("../models/User");

exports.voteOnResource = async (req, res) => {
  const userId = req.userId;
  const { resourceId, voteType } = req.body;

  if (!["up", "down"].includes(voteType)) {
    return res.status(400).json({ message: "Invalid vote type" });
  }

  try {
    //Checks if user has already votes
    const existingVote = await Vote.findOne({ userId, resourceId });
    if (existingVote) {
      return res.status(400).json({ message: "You have already voted on this resource" });
    }

    // Create new vote
    const vote = new Vote({ userId, resourceId, voteType });
    await vote.save();

    // Update resource's vote count
    const voteChange = voteType === "up" ? 1 : -1;

    const resource = await Resource.findByIdAndUpdate(
      resourceId,
      { $inc: { upvotesCount: voteChange } },
      { new: true }
    );

    // Update uploader's reputation
    await User.findByIdAndUpdate(
      resource.uploaderUserId,
      { $inc: { reputationPoints: voteChange } }
    );

    return res.status(200).json({ message: "Vote recorded successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error voting on resource", error: err.message });
  }
};
