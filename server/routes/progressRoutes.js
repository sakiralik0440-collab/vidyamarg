const express = require("express");
const router = express.Router();
const {
  addProgressRecord,
  getProgressByStudent,
  updateProgressRecord,
  deleteProgressRecord,
} = require("../controllers/progressController");

// POST /api/progress - Add new progress record
router.post("/", addProgressRecord);

// GET /api/progress/:studentId - Get all records for a student
router.get("/:studentId", getProgressByStudent);

// PUT /api/progress/:progressId - Update a record
router.put("/:progressId", updateProgressRecord);

// DELETE /api/progress/:progressId - Delete a record
router.delete("/:progressId", deleteProgressRecord);

module.exports = router;