const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getCompanyDashboard,
  createJobPosting,
  searchCandidates,
  scheduleInterview,
} = require("../controllers/companyPortalController");

router.use(protect);

// GET /api/company/dashboard
router.get("/dashboard", getCompanyDashboard);

// POST /api/company/jobs
router.post("/jobs", createJobPosting);

// GET /api/company/candidates
router.get("/candidates", searchCandidates);

// POST /api/company/interviews/schedule
router.post("/interviews/schedule", scheduleInterview);

module.exports = router;
