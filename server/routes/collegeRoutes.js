const express = require("express");
const router = express.Router();
const {
  addCollege,
  getAllColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
  matchColleges,
} = require("../controllers/collegeController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/colleges/match - Match colleges for student (public)
router.post("/match", matchColleges);

// GET /api/colleges - Get all colleges (public)
router.get("/", getAllColleges);

// GET /api/colleges/:id - Get single college (public)
router.get("/:id", getCollegeById);

// POST /api/colleges - Add college (protected)
router.post("/", protect, addCollege);

// PUT /api/colleges/:id - Update college (protected)
router.put("/:id", protect, updateCollege);

// DELETE /api/colleges/:id - Delete college (protected)
router.delete("/:id", protect, deleteCollege);

module.exports = router;