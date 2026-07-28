const Scholarship = require("../models/Scholarship");

// @desc    Get all scholarships
// @route   GET /api/scholarships
// @access  Public
const getAllScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find({ isActive: true }).sort({
      amount: -1,
    });
    res.status(200).json({
      success: true,
      count: scholarships.length,
      scholarships,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Match scholarships for a student
// @route   POST /api/scholarships/match
// @access  Public
const matchScholarships = async (req, res) => {
  try {
    const {
      category,
      marksPercentage,
      stream,
      currentClass,
      gender,
      state,
      familyIncome,
    } = req.body;

    // Get all active scholarships
    const allScholarships = await Scholarship.find({ isActive: true });

    const matchedScholarships = [];

    allScholarships.forEach((scholarship) => {
      const eligibility = scholarship.eligibility;
      let qualifies = true;
      let matchScore = 0;
      const reasons = [];
      const missing = [];

      // Check category eligibility
      if (
        eligibility.categories.length > 0 &&
        !eligibility.categories.includes(category)
      ) {
        qualifies = false;
        missing.push(`Category must be: ${eligibility.categories.join(", ")}`);
      } else {
        matchScore += 25;
        reasons.push("✅ Category matches");
      }

      // Check marks eligibility
      if (
        eligibility.minMarks > 0 &&
        marksPercentage < eligibility.minMarks
      ) {
        qualifies = false;
        missing.push(`Minimum ${eligibility.minMarks}% marks required`);
      } else if (marksPercentage >= eligibility.minMarks) {
        matchScore += 20;
        reasons.push(`✅ Marks qualify (${marksPercentage}% ≥ ${eligibility.minMarks}%)`);
      }

      // Check stream eligibility
      if (
        eligibility.streams.length > 0 &&
        !eligibility.streams.includes(stream)
      ) {
        qualifies = false;
        missing.push(`Stream must be: ${eligibility.streams.join(", ")}`);
      } else {
        matchScore += 15;
        reasons.push("✅ Stream matches");
      }

      // Check class eligibility
      if (
        eligibility.classes.length > 0 &&
        !eligibility.classes.includes(currentClass)
      ) {
        qualifies = false;
        missing.push(`Class must be: ${eligibility.classes.join(", ")}`);
      } else {
        matchScore += 15;
        reasons.push("✅ Class matches");
      }

      // Check gender eligibility
      if (
        eligibility.gender !== "Any" &&
        eligibility.gender !== gender
      ) {
        qualifies = false;
        missing.push(`Only for ${eligibility.gender} students`);
      } else {
        matchScore += 10;
      }

      // Check state eligibility
      if (
        eligibility.states.length > 0 &&
        !eligibility.states.includes(state)
      ) {
        qualifies = false;
        missing.push(`Only for students from: ${eligibility.states.join(", ")}`);
      } else {
        matchScore += 10;
      }

      // Check income eligibility
      if (
        eligibility.maxFamilyIncome > 0 &&
        familyIncome &&
        familyIncome > eligibility.maxFamilyIncome
      ) {
        qualifies = false;
        missing.push(
          `Family income must be below ₹${eligibility.maxFamilyIncome.toLocaleString("en-IN")}`
        );
      } else if (eligibility.maxFamilyIncome > 0) {
        matchScore += 5;
        reasons.push("✅ Income eligible");
      }

      // Check deadline
      const isDeadlinePassed =
        scholarship.deadline && new Date(scholarship.deadline) < new Date();

      if (qualifies) {
        matchedScholarships.push({
          ...scholarship.toObject(),
          matchScore,
          reasons,
          missing,
          isDeadlinePassed,
        });
      }
    });

    // Sort by match score then by amount
    matchedScholarships.sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      return (b.amount || 0) - (a.amount || 0);
    });

    res.status(200).json({
      success: true,
      count: matchedScholarships.length,
      scholarships: matchedScholarships,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single scholarship
// @route   GET /api/scholarships/:id
// @access  Public
const getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: "Scholarship not found",
      });
    }
    res.status(200).json({ success: true, scholarship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllScholarships,
  matchScholarships,
  getScholarshipById,
};