const express = require("express");
const router = express.Router();
const {
  submitRequest,
  trackRequest,
  getAllRequests,
  respondToRequest,
} = require("../controllers/helplineController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/", submitRequest);
router.get("/:anonymousId", trackRequest);

// Protected routes
router.get("/", protect, getAllRequests);
router.put("/:id/respond", protect, respondToRequest);

module.exports = router;