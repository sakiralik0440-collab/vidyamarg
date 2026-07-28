const express = require("express");
const router = express.Router();
const {
  getAllExams,
  getStudentExams,
  sendExamReminders,
} = require("../controllers/examController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllExams);
router.get("/student/:studentId", getStudentExams);
router.post("/send-reminders", protect, sendExamReminders);

module.exports = router;