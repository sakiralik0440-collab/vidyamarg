const { runDropoutDetection } = require("../utils/dropoutDetection");
const Student = require("../models/Student");

// @desc    Run dropout detection for all students
// @route   POST /api/dropout/run
// @access  Private (Teacher/Admin — auth added later)
const runDetection = async (req, res) => {
  try {
    const result = await runDropoutDetection();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all at-risk and dropout students
// @route   GET /api/dropout/at-risk
// @access  Private
const getAtRiskStudents = async (req, res) => {
  try {
    const atRiskStudents = await Student.find({
      status: { $in: ["At Risk", "Dropout"] },
    }).populate("familyContacts");

    res.status(200).json({
      success: true,
      count: atRiskStudents.length,
      students: atRiskStudents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const { recalculateAllScores } = require("../utils/activityScore");

// @desc    Recalculate activity scores for all students
// @route   POST /api/dropout/recalculate-scores
// @access  Private
const recalculateScores = async (req, res) => {
  try {
    const result = await recalculateAllScores();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dropout statistics for dashboard
// @route   GET /api/dropout/stats
// @access  Private
const getDropoutStats = async (req, res) => {
  try {
    const total = await Student.countDocuments();
    const active = await Student.countDocuments({ status: "Active" });
    const atRisk = await Student.countDocuments({ status: "At Risk" });
    const dropout = await Student.countDocuments({ status: "Dropout" });
    const placed = await Student.countDocuments({ status: "Placed" });
    const graduated = await Student.countDocuments({ status: "Graduated" });

    res.status(200).json({
      success: true,
      stats: {
        total,
        active,
        atRisk,
        dropout,
        placed,
        graduated,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  runDetection,
  getAtRiskStudents,
  getDropoutStats,
  recalculateScores,
};