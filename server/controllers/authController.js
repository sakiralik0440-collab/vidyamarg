const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// @desc    Register a new teacher
// @route   POST /api/auth/register
// @access  Public
const registerTeacher = async (req, res) => {
  try {
    const { name, email, password, village, district, state, phone } = req.body;

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: "A teacher with this email already exists",
      });
    }

    // Create teacher (password auto-hashed by pre-save hook)
    const teacher = await Teacher.create({
      name,
      email,
      password,
      village,
      district,
      state,
      phone,
    });

    // Generate token
    const token = generateToken(teacher._id);

    res.status(201).json({
      success: true,
      message: "Teacher registered successfully",
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        village: teacher.village,
        district: teacher.district,
        role: teacher.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login teacher
// @route   POST /api/auth/login
// @access  Public
const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find teacher by email
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if account is active
    if (!teacher.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    // Verify password using our custom method
    const isMatch = await teacher.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(teacher._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        village: teacher.village,
        district: teacher.district,
        role: teacher.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in teacher
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      teacher: req.teacher,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerTeacher, loginTeacher, getMe };