const express = require("express");
const router = express.Router();
const {
  registerCompany,
  loginCompany,
  getCompanyProfile,
  searchStudents,
  postJob,
  getAllJobs,
  getMatchingJobs,
} = require("../controllers/companyController");

const { protectCompany } = require("../middleware/authMiddleware");

// Public routes
// POST /api/company/jobs/match - Get matching jobs for student
router.post("/jobs/match", getMatchingJobs);

router.post("/register", registerCompany);
router.post("/login", loginCompany);
router.get("/jobs", getAllJobs);

// Protected company routes
router.get("/me", protectCompany, getCompanyProfile);
router.get("/search-students", protectCompany, searchStudents);
router.post("/jobs", protectCompany, postJob);

module.exports = router;