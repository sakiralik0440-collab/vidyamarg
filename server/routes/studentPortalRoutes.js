const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  getStudentDashboard,
  applyForJob,
  submitAchievement,
} = require("../controllers/studentPortalController");

// All routes here require logged-in user
router.use(protect);

// GET /api/student/dashboard
router.get("/dashboard", getStudentDashboard);

// POST /api/student/jobs/:id/apply
router.post("/jobs/:id/apply", applyForJob);

// POST /api/student/achievements
router.post("/achievements", submitAchievement);

module.exports = router;
