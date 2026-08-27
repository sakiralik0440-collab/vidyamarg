const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");
const College = require("../models/College");
const Company = require("../models/Company");
const Teacher = require("../models/Teacher");
const SystemLog = require("../models/SystemLog");

// Generate JWT token with user id
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "vidyamarg_secret_key_2026", {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// @desc    Register a new user (Student, Parent, College, Company, Admin)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "student",
      phone,
      // Student specific
      rollNo,
      course,
      branch,
      semester,
      village,
      district,
      state,
      category,
      gender,
      dateOfBirth,
      // College specific
      collegeName,
      code,
      website,
      address,
      // Company specific
      companyName,
      industry,
      location,
    } = req.body;

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Create central user
    const user = await User.create({
      name: name || companyName || collegeName,
      email,
      password,
      role,
      phone,
      status: role === "college" || role === "company" ? "pending" : "active", // Requires verification for institutional accounts
    });

    let extraProfile = null;

    // Role-specific sub-document creation
    if (role === "student") {
      extraProfile = await Student.create({
        userId: user._id,
        name: user.name,
        rollNo: rollNo || `VM-${Date.now().toString().slice(-6)}`,
        gender: gender || "Other",
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
        village: village || "Rural Area",
        district: district || "Indore",
        state: state || "Madhya Pradesh",
        category: category || "General",
        currentClass: course ? `${course} ${semester ? `Sem ${semester}` : ""}` : "B.Tech 1st Year",
        stream: branch || "Not Applicable",
        careerReadinessScore: 50,
      });
    } else if (role === "college") {
      extraProfile = await College.create({
        userId: user._id,
        name: collegeName || name,
        code: code || `COL-${Date.now().toString().slice(-4)}`,
        address: address || `${district || "Indore"}, ${state || "Madhya Pradesh"}`,
        district: district || "Indore",
        state: state || "Madhya Pradesh",
        website: website || "",
        isVerified: false,
      });
    } else if (role === "company") {
      extraProfile = await Company.create({
        userId: user._id,
        companyName: companyName || name,
        email: user.email,
        password, // Pre-hashed by companySchema
        location: location || `${district || "Indore"}, ${state || "Madhya Pradesh"}`,
        district: district || "Indore",
        state: state || "Madhya Pradesh",
        industryType: industry || "Technology / IT",
        phone: phone || "",
        website: website || "",
        isVerified: false,
      });
    }

    // Audit log
    await SystemLog.create({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      action: "User Registration",
      category: "AUTH",
      details: `New ${user.role} account registered for ${user.email}`,
    }).catch((e) => console.log("Audit log failed:", e.message));

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} registered successfully`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        profile: extraProfile,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user across any of the 5 roles
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // 1. Try finding in central User collection
    let user = await User.findOne({ email });

    // 2. Legacy fallback for Teacher if not migrated yet
    if (!user) {
      const teacher = await Teacher.findOne({ email });
      if (teacher) {
        const isMatch = await teacher.matchPassword(password);
        if (!isMatch) {
          return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        const token = generateToken(teacher._id, "college");
        return res.status(200).json({
          success: true,
          message: "Login successful",
          token,
          user: {
            id: teacher._id,
            name: teacher.name,
            email: teacher.email,
            role: teacher.role === "admin" ? "admin" : "college",
            status: "active",
          },
        });
      }
    }

    // 3. Legacy fallback for Company if not in User
    if (!user) {
      const company = await Company.findOne({ email });
      if (company) {
        const isMatch = await company.matchPassword(password);
        if (!isMatch) {
          return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        const token = generateToken(company._id, "company");
        return res.status(200).json({
          success: true,
          message: "Login successful",
          token,
          user: {
            id: company._id,
            name: company.companyName,
            email: company.email,
            role: "company",
            status: company.isVerified ? "active" : "pending",
          },
        });
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check optional role match if user specifically selected a portal tab
    if (role && user.role !== role && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: `This account is registered as a '${user.role}', not '${role}'. Please use the ${user.role} portal.`,
      });
    }

    // Check account status
    if (user.status === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended. Please contact admin support.",
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    // Fetch role-specific details
    let profile = null;
    if (user.role === "student") {
      profile = await Student.findOne({ userId: user._id });
    } else if (user.role === "college") {
      profile = await College.findOne({ userId: user._id });
    } else if (user.role === "company") {
      profile = await Company.findOne({ userId: user._id });
    }

    // Audit log
    await SystemLog.create({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      action: "User Login",
      category: "AUTH",
      details: `Successful login for ${user.email} as ${user.role}`,
    }).catch((e) => console.log("Audit log failed:", e.message));

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        profile,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile & linked entity
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let profile = null;
    if (user.role === "student") {
      profile = await Student.findOne({ userId: user._id });
    } else if (user.role === "college") {
      profile = await College.findOne({ userId: user._id });
    } else if (user.role === "company") {
      profile = await Company.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        avatar: user.avatar,
        profile,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Legacy support aliases for backwards compatibility
const registerTeacher = registerUser;
const loginTeacher = loginUser;

module.exports = {
  registerUser,
  loginUser,
  getMe,
  registerTeacher,
  loginTeacher,
};