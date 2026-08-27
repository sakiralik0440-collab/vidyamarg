const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getCollegeDashboard,
  markBatchAttendance,
  verifyAchievement,
} = require("../controllers/collegePortalController");

router.use(protect);

// GET /api/college/dashboard
router.get("/dashboard", getCollegeDashboard);

// POST /api/college/attendance/batch
router.post("/attendance/batch", markBatchAttendance);

// PATCH /api/college/achievements/:id/verify
router.patch("/achievements/:id/verify", verifyAchievement);

module.exports = router;
