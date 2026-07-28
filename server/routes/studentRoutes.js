const express = require("express");
const router = express.Router();
const {
  registerStudent,
  getAllStudents,
  getStudentById,
  getFilteredStudents,
  getActivityScoreBreakdown,
  getParentDashboard,
  findByPhone,
} = require("../controllers/studentController");

const { protect } = require("../middleware/authMiddleware");



// POST /api/students - Register new student (public — students register themselves)
router.post("/", registerStudent);

// GET /api/students/filter - Filter students (protected)
router.get("/filter", protect, getFilteredStudents);

// GET /api/students/:id/score - Get activity score breakdown
router.get("/:id/score", getActivityScoreBreakdown);

// GET /api/students/:id/parent-dashboard
router.get("/:id/parent-dashboard", getParentDashboard);

// GET /api/students - Get all students (protected — teachers only)
router.get("/", protect, getAllStudents);


router.get("/find-by-phone/:phone", findByPhone);

// GET /api/students/:id - Public for now (students view own profile)
router.get("/:id", getStudentById);

module.exports = router;