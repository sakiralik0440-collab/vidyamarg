const Achievement = require("../models/Achievement");
const Student = require("../models/Student");

// @desc    Add achievement for a student
// @route   POST /api/achievements
// @access  Public (student adds own)
const addAchievement = async (req, res) => {
  try {
    const {
      studentId,
      title,
      category,
      description,
      level,
      position,
      date,
      academicYear,
    } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const achievement = await Achievement.create({
      student: studentId,
      title,
      category,
      description,
      level,
      position,
      date,
      academicYear,
    });

    // Boost activity score for achievements
    const boost =
      level === "National" || level === "International"
        ? 10
        : level === "State"
        ? 7
        : level === "District"
        ? 5
        : 3;

    student.activityScore = Math.min(
      student.activityScore + boost,
      100
    );
    await student.save();

    res.status(201).json({
      success: true,
      message: "Achievement added successfully",
      achievement,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all achievements for a student
// @route   GET /api/achievements/student/:studentId
// @access  Public
const getStudentAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({
      student: req.params.studentId,
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: achievements.length,
      achievements,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get public achievement wall (all students)
// @route   GET /api/achievements/wall
// @access  Public
const getAchievementWall = async (req, res) => {
  try {
    const { village, district, category, level } = req.query;

    const filter = { isPublic: true };
    if (category) filter.category = category;
    if (level) filter.level = level;

    const achievements = await Achievement.find(filter)
      .populate("student", "name village district")
      .sort({ createdAt: -1 })
      .limit(50);

    // Filter by location after populate
    let filtered = achievements;
    if (village) {
      filtered = achievements.filter((a) =>
        a.student?.village
          ?.toLowerCase()
          .includes(village.toLowerCase())
      );
    } else if (district) {
      filtered = achievements.filter((a) =>
        a.student?.district
          ?.toLowerCase()
          .includes(district.toLowerCase())
      );
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      achievements: filtered,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Like an achievement
// @route   PUT /api/achievements/:id/like
// @access  Public
const likeAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }

    res.status(200).json({
      success: true,
      likes: achievement.likes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an achievement
// @route   DELETE /api/achievements/:id
// @access  Public
const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }
    res.status(200).json({ success: true, message: "Achievement deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify an achievement (teacher only)
// @route   PUT /api/achievements/:id/verify
// @access  Private (Teacher)
const verifyAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      {
        isVerified: true,
        verifiedBy: req.teacher._id,
      },
      { new: true }
    );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Achievement verified",
      achievement,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addAchievement,
  getStudentAchievements,
  getAchievementWall,
  likeAchievement,
  deleteAchievement,
  verifyAchievement,
};