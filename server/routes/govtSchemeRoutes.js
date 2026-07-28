const express = require("express");
const router = express.Router();
const {
  getAllSchemes,
  matchSchemes,
  sendSchemeAlerts,
} = require("../controllers/govtSchemeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllSchemes);
router.post("/match", matchSchemes);
router.post("/send-alerts", protect, sendSchemeAlerts);

module.exports = router;