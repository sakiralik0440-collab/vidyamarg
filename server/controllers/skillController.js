const SkillCourse = require("../models/SkillCourse");

// @desc    Get all skill courses
// @route   GET /api/skills
// @access  Public
const getAllSkillCourses = async (req, res) => {
  try {
    const courses = await SkillCourse.find({ isActive: true }).sort({
      isGovernmentFunded: -1,
      fees: 1,
    });
    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Match skill courses for a student
// @route   POST /api/skills/match
// @access  Public
const matchSkillCourses = async (req, res) => {
  try {
    const { education, age, gender, district, state, trade, preferFree } =
      req.body;

    const allCourses = await SkillCourse.find({ isActive: true });
    const matched = [];

    allCourses.forEach((course) => {
      let matchScore = 0;
      let qualifies = true;

      // Education check
      const educationLevels = [
        "5th Pass",
        "8th Pass",
        "10th Pass",
        "12th Pass",
      ];
      const studentLevel = educationLevels.indexOf(education);
      const requiredLevel = educationLevels.indexOf(
        course.eligibility.minEducation
      );

      if (studentLevel < requiredLevel) {
        qualifies = false;
      } else {
        matchScore += 30;
      }

      // Age check
      if (
        age &&
        (age < course.eligibility.minAge || age > course.eligibility.maxAge)
      ) {
        qualifies = false;
      } else {
        matchScore += 10;
      }

      // Gender check
      if (
        course.eligibility.gender !== "Any" &&
        gender &&
        course.eligibility.gender !== gender
      ) {
        qualifies = false;
      } else {
        matchScore += 10;
      }

      // Location match — same district = higher score
      if (
        district &&
        course.district &&
        course.district.toLowerCase() === district.toLowerCase()
      ) {
        matchScore += 30;
      } else if (
        state &&
        course.state &&
        course.state.toLowerCase() === state.toLowerCase()
      ) {
        matchScore += 15;
      }

      // Trade interest match
      if (
        trade &&
        course.trade.toLowerCase().includes(trade.toLowerCase())
      ) {
        matchScore += 20;
      }

      // Free course preference
      if (preferFree && course.fees === 0) {
        matchScore += 15;
      }

      // Government funded boost
      if (course.isGovernmentFunded) {
        matchScore += 10;
      }

      if (qualifies) {
        matched.push({
          ...course.toObject(),
          matchScore: Math.min(matchScore, 100),
        });
      }
    });

    matched.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      count: matched.length,
      courses: matched,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllSkillCourses, matchSkillCourses };