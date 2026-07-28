const express = require("express");
const router = express.Router();
const {
  registerTeacher,
  loginTeacher,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/register
router.post("/register", registerTeacher);

// POST /api/auth/login
router.post("/login", loginTeacher);

// GET /api/auth/me (protected)
router.get("/me", protect, getMe);

module.exports = router;