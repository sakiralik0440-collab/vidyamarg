const express = require("express");
const router = express.Router();
const {
  getFeeTracker,
  addEntry,
  deleteEntry,
} = require("../controllers/feeTrackerController");

router.get("/:studentId", getFeeTracker);
router.post("/:studentId", addEntry);
router.delete("/:studentId/:entryId", deleteEntry);

module.exports = router;