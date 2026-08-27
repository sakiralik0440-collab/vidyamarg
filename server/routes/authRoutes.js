const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/register (All roles: student, parent, college, company, admin)
router.post("/register", registerUser);

// POST /api/auth/login (All roles)
router.post("/login", loginUser);

// GET /api/auth/me (Protected - current logged-in user)
router.get("/me", protect, getMe);

module.exports = router;