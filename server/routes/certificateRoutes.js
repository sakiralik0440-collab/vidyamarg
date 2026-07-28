const express = require("express");
const router = express.Router();
const {
  issueCertificate,
  getStudentCertificates,
  autoGenerateCertificates,
  deleteCertificate,
} = require("../controllers/certificateController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/certificates - Issue certificate (protected)
router.post("/", protect, issueCertificate);

// POST /api/certificates/auto-generate - Auto generate (protected)
router.post("/auto-generate", protect, autoGenerateCertificates);

// GET /api/certificates/:studentId - Get student certificates (public)
router.get("/:studentId", getStudentCertificates);

// DELETE /api/certificates/:certificateId - Delete (protected)
router.delete("/:certificateId", protect, deleteCertificate);

module.exports = router;