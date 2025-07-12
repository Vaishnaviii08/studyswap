const express = require("express");
const router = express.Router();
const { voteOnResource } = require("../controllers/voteController");
const auth = require("../middleware/auth");

router.post("/", auth, voteOnResource);

module.exports = router;