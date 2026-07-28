const express = require("express");
const router = express.Router();
const {
  runDetection,
  getAtRiskStudents,
  getDropoutStats,
  recalculateScores,
} = require("../controllers/dropoutController");
const { protect } = require("../middleware/authMiddleware");

// All dropout routes are protected
router.post("/run", protect, runDetection);
router.get("/at-risk", protect, getAtRiskStudents);
router.get("/stats", protect, getDropoutStats);
router.post("/recalculate-scores", protect, recalculateScores);

module.exports = router;