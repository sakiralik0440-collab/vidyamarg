const express = require("express");
const router = express.Router();
const {
  getDistrictOverview,
  getVillageBreakdown,
  getStreamAnalysis,
} = require("../controllers/districtController");
const { protect } = require("../middleware/authMiddleware");

router.get("/overview", protect, getDistrictOverview);
router.get("/stream-analysis", protect, getStreamAnalysis);
router.get("/:district/villages", protect, getVillageBreakdown);

module.exports = router;