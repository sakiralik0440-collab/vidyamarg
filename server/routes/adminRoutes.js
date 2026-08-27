const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getAdminDashboard,
  verifyCollege,
  verifyCompany,
  getAllUsers,
  getSystemLogs,
} = require("../controllers/adminController");

router.use(protect);
router.use(adminOnly);

// GET /api/admin/dashboard
router.get("/dashboard", getAdminDashboard);

// PATCH /api/admin/colleges/:id/verify
router.patch("/colleges/:id/verify", verifyCollege);

// PATCH /api/admin/companies/:id/verify
router.patch("/companies/:id/verify", verifyCompany);

// GET /api/admin/users
router.get("/users", getAllUsers);

// GET /api/admin/logs
router.get("/logs", getSystemLogs);

module.exports = router;
