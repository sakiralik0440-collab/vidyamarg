const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");
const Company = require("../models/Company");

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach teacher to request object (without password)
      req.teacher = await Teacher.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
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
  if (req.teacher && req.teacher.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized, admin access required",
    });
  }
};

const protectCompany = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check it's a company token
      if (decoded.type !== "company") {
        return res.status(401).json({
          success: false,
          message: "Not authorized as company",
        });
      }

      req.company = await Company.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
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

module.exports = { protect, adminOnly, protectCompany };