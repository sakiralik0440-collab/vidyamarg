const express = require("express");
const router = express.Router();
const {
  addAchievement,
  getStudentAchievements,
  getAchievementWall,
  likeAchievement,
  deleteAchievement,
  verifyAchievement,
} = require("../controllers/achievementController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/wall", getAchievementWall);
router.get("/student/:studentId", getStudentAchievements);
router.post("/", addAchievement);
router.put("/:id/like", likeAchievement);
router.delete("/:id", deleteAchievement);

// Protected routes
router.put("/:id/verify", protect, verifyAchievement);

module.exports = router;