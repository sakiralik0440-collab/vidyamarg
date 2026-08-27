const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Teacher = require("../models/Teacher");
const Company = require("../models/Company");

// Protect middleware - works for all 5 roles (student, parent, college, company, admin)
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check User model first
      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        req.user = user;
        // For backwards compatibility
        if (user.role === "college") req.teacher = user;
        if (user.role === "company") req.company = user;
        return next();
      }

      // Legacy fallback to Teacher model
      const teacher = await Teacher.findById(decoded.id).select("-password");
      if (teacher) {
        req.teacher = teacher;
        req.user = {
          _id: teacher._id,
          name: teacher.name,
          email: teacher.email,
          role: teacher.role === "admin" ? "admin" : "college",
        };
        return next();
      }

      // Legacy fallback to Company model
      const company = await Company.findById(decoded.id).select("-password");
      if (company) {
        req.company = company;
        req.user = {
          _id: company._id,
          name: company.companyName,
          email: company.email,
          role: "company",
        };
        return next();
      }

      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found",
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token invalid or expired",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (
    (req.user && req.user.role === "admin") ||
    (req.teacher && req.teacher.role === "admin")
  ) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized, admin access required",
    });
  }
};

// Protect Company
const protectCompany = async (req, res, next) => {
  return protect(req, res, () => {
    if (req.user && (req.user.role === "company" || req.user.role === "admin")) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: "Not authorized as company recruiter",
    });
  });
};

module.exports = { protect, adminOnly, protectCompany };