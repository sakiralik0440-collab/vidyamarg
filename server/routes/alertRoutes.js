const express = require("express");
const router = express.Router();
const {
  sendManualAlert,
  sendAutoDropoutAlerts,
  getAlertHistory,
  sendCustomAlert,
} = require("../controllers/alertController");
const { protect } = require("../middleware/authMiddleware");


// POST /api/alerts/custom - Send custom message
router.post("/custom", protect, sendCustomAlert);

// POST /api/alerts/send - Send manual alert
router.post("/send", protect, sendManualAlert);

// POST /api/alerts/auto-dropout - Send auto dropout alerts
router.post("/auto-dropout", protect, sendAutoDropoutAlerts);

// GET /api/alerts/:studentId - Get alert history
router.get("/:studentId", protect, getAlertHistory);

module.exports = router;