const express = require("express");
const router = express.Router();
const {
  getLeaderboard,
  getDistrictComparison,
} = require("../controllers/leaderboardController");

// GET /api/leaderboard - Get village leaderboard
router.get("/", getLeaderboard);

// GET /api/leaderboard/district - Get district comparison
router.get("/district", getDistrictComparison);

module.exports = router;