const User = require("../models/User");
const Student = require("../models/Student");
const College = require("../models/College");
const Company = require("../models/Company");
const SystemLog = require("../models/SystemLog");
const GovtScheme = require("../models/GovtScheme");
const Scholarship = require("../models/Scholarship");

// @desc    Get Super Admin Dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalColleges,
      totalCompanies,
      pendingColleges,
      pendingCompanies,
      recentLogs,
      schemes,
      scholarships,
    ] = await Promise.all([
      User.countDocuments(),
      Student.countDocuments(),
      College.countDocuments(),
      Company.countDocuments(),
      College.find({ isVerified: false }),
      Company.find({ isVerified: false }),
      SystemLog.find().sort({ createdAt: -1 }).limit(15),
      GovtScheme.find().sort({ createdAt: -1 }).limit(5),
      Scholarship.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        stats: {
          totalUsers,
          totalStudents,
          totalColleges,
          totalCompanies,
          pendingVerifications: pendingColleges.length + pendingCompanies.length,
          activeSchemes: schemes.length,
          activeScholarships: scholarships.length,
          systemStatus: "Healthy (100% Uptime)",
        },
        pendingColleges,
        pendingCompanies,
        recentLogs,
        schemes,
        scholarships,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify or Reject College
// @route   PATCH /api/admin/colleges/:id/verify
// @access  Private (Admin)
const verifyCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const college = await College.findByIdAndUpdate(id, { isVerified }, { new: true });
    if (!college) {
      return res.status(404).json({ success: false, message: "College not found" });
    }

    if (college.userId) {
      await User.findByIdAndUpdate(college.userId, { status: isVerified ? "active" : "suspended" });
    }

    await SystemLog.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: "admin",
      action: isVerified ? "College Verified" : "College Rejected",
      category: "VERIFICATION",
      details: `${college.name} status updated to ${isVerified ? "Verified" : "Unverified"}`,
    });

    res.status(200).json({
      success: true,
      message: `College ${isVerified ? "verified" : "unverified"} successfully`,
      college,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify or Reject Company
// @route   PATCH /api/admin/companies/:id/verify
// @access  Private (Admin)
const verifyCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const company = await Company.findByIdAndUpdate(id, { isVerified }, { new: true });
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    if (company.userId) {
      await User.findByIdAndUpdate(company.userId, { status: isVerified ? "active" : "suspended" });
    }

    await SystemLog.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: "admin",
      action: isVerified ? "Company Verified" : "Company Rejected",
      category: "VERIFICATION",
      details: `${company.companyName} recruiter verification status set to ${isVerified ? "Verified" : "Unverified"}`,
    });

    res.status(200).json({
      success: true,
      message: `Company ${isVerified ? "verified" : "unverified"} successfully`,
      company,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get security audit logs
// @route   GET /api/admin/logs
// @access  Private (Admin)
const getSystemLogs = async (req, res) => {
  try {
    const logs = await SystemLog.find().sort({ createdAt: -1 }).limit(100);
    res.status(200).json({ success: true, count: logs.length, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminDashboard,
  verifyCollege,
  verifyCompany,
  getAllUsers,
  getSystemLogs,
};
