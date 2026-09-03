const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const leaderboardController = require("../controllers/leaderboardController");

router.get("/", authenticateUser, leaderboardController.getLeaderboard);

module.exports = router;
