const express = require("express");
const router = express.Router();
const {
  getAllScholarships,
  matchScholarships,
  getScholarshipById,
} = require("../controllers/scholarshipController");

// POST /api/scholarships/match - Match scholarships (before /:id)
router.post("/match", matchScholarships);

// GET /api/scholarships - Get all
router.get("/", getAllScholarships);

// GET /api/scholarships/:id - Get one
router.get("/:id", getScholarshipById);

module.exports = router;