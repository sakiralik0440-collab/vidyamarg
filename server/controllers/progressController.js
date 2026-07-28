const Progress = require("../models/Progress");
const Student = require("../models/Student");
const { runDetectionForStudent } = require("../utils/dropoutDetection");
const { updateStudentActivityScore } = require("../utils/activityScore");

// @desc    Add a new progress record for a student
// @route   POST /api/progress
// @access  Public
const addProgressRecord = async (req, res) => {
  try {
    const {
      studentId,
      academicYear,
      className,
      marksPercentage,
      result,
      attendancePercentage,
      remarks,
    } = req.body;

    // Step 1: Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Step 2: Check if a record for this academic year already exists
    const existingRecord = await Progress.findOne({
      student: studentId,
      academicYear,
    });

    if (existingRecord) {
      return res.status(400).json({
        success: false,
        message: `A record for ${academicYear} already exists for this student`,
      });
    }

    // Step 3: Create the progress record
    const progress = await Progress.create({
      student: studentId,
      academicYear,
      className,
      marksPercentage,
      result,
      attendancePercentage,
      remarks,
    });

    // Step 4: Update lastUpdated, recalculate activity score, run dropout detection
    student.lastUpdated = Date.now();
    await student.save();

    // Recalculate activity score with new progress data
    await updateStudentActivityScore(student);

    // Run dropout detection
    await runDetectionForStudent(studentId);

    res.status(201).json({
      success: true,
      message: "Progress record saved successfully",
      progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all progress records for a student
// @route   GET /api/progress/:studentId
// @access  Public
const getProgressByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Fetch all progress records, sorted by academic year
    const records = await Progress.find({ student: studentId }).sort({
      academicYear: 1,
    });

    res.status(200).json({
      success: true,
      records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update an existing progress record
// @route   PUT /api/progress/:progressId
// @access  Public
const updateProgressRecord = async (req, res) => {
  try {
    const progress = await Progress.findByIdAndUpdate(
      req.params.progressId,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Progress record updated",
      progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a progress record
// @route   DELETE /api/progress/:progressId
// @access  Public
const deleteProgressRecord = async (req, res) => {
  try {
    const progress = await Progress.findByIdAndDelete(req.params.progressId);

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Progress record deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addProgressRecord,
  getProgressByStudent,
  updateProgressRecord,
  deleteProgressRecord,
};