const express = require("express");
const router = express.Router();
const {
  sendInterviewRequest,
  getStudentInterviews,
  getCompanyInterviews,
  updateInterviewStatus,
  getInterviewStats,
} = require("../controllers/interviewController");
const { protect, protectCompany } = require("../middleware/authMiddleware");

// POST /api/interviews - Send interview request (company)
router.post("/", protectCompany, sendInterviewRequest);

// GET /api/interviews/student/:studentId - Get student's interviews (public)
router.get("/student/:studentId", getStudentInterviews);

// GET /api/interviews/company - Get company's sent requests (company)
router.get("/company", protectCompany, getCompanyInterviews);

// GET /api/interviews/stats - Get stats (teacher)
router.get("/stats", protect, getInterviewStats);

// PUT /api/interviews/:id - Update status (public)
router.put("/:id", updateInterviewStatus);

module.exports = router;