const Mentor = require("../models/Mentor");

// @desc    Get all mentors
// @route   GET /api/mentors
// @access  Public
const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({ isActive: true }).sort({
      isVerified: -1,
    });
    res.status(200).json({
      success: true,
      count: mentors.length,
      mentors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Match mentors for a student
// @route   POST /api/mentors/match
// @access  Public
const matchMentors = async (req, res) => {
  try {
    const { stream, field, district, state, needGuidanceIn } = req.body;

    const allMentors = await Mentor.find({ isActive: true });
    const matched = [];

    allMentors.forEach((mentor) => {
      let matchScore = 0;

      // Same district = highest priority
      if (
        district &&
        mentor.district.toLowerCase() === district.toLowerCase()
      ) {
        matchScore += 40;
      } else if (
        state &&
        mentor.state.toLowerCase() === state.toLowerCase()
      ) {
        matchScore += 15;
      }

      // Stream match
      if (stream && mentor.stream === stream) {
        matchScore += 25;
      }

      // Field/interest match
      if (field && mentor.field.toLowerCase().includes(field.toLowerCase())) {
        matchScore += 20;
      }

      // Guidance area match
      if (needGuidanceIn && mentor.canMentorIn) {
        const matchedAreas = mentor.canMentorIn.filter((area) =>
          area.toLowerCase().includes(needGuidanceIn.toLowerCase())
        );
        if (matchedAreas.length > 0) matchScore += 15;
      }

      // Verified bonus
      if (mentor.isVerified) matchScore += 10;

      matched.push({
        ...mentor.toObject(),
        matchScore: Math.min(matchScore, 100),
      });
    });

    matched.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      count: matched.length,
      mentors: matched,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register as a mentor
// @route   POST /api/mentors/register
// @access  Public
const registerMentor = async (req, res) => {
  try {
    const mentor = await Mentor.create({
      ...req.body,
      isVerified: false,
    });
    res.status(201).json({
      success: true,
      message:
        "Mentor registered successfully! Will be verified by admin shortly.",
      mentor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllMentors, matchMentors, registerMentor };