const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getParentDashboard,
  linkChild,
} = require("../controllers/parentPortalController");

router.use(protect);

// GET /api/parent/dashboard
router.get("/dashboard", getParentDashboard);

// POST /api/parent/link-child
router.post("/link-child", linkChild);

module.exports = router;
