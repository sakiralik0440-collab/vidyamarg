const College = require("../models/College");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const ExamResult = require("../models/ExamResult");
const Achievement = require("../models/Achievement");
const Job = require("../models/Job");
const Alert = require("../models/Alert");

// @desc    Get College Portal Dashboard overview
// @route   GET /api/college/dashboard
// @access  Private (College / Teacher)
const getCollegeDashboard = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    let college = await College.findOne({ userId });
    if (!college) college = await College.findOne();

    const [students, achievementsPending, activeDrives, recentAlerts] = await Promise.all([
      Student.find().sort({ createdAt: -1 }),
      Achievement.find({ status: "Pending" }).populate("student studentId", "name rollNo currentClass"),
      Job.find({ jobType: "Campus Drive", status: "Active" }),
      Alert.find({ role: { $in: ["college", "all"] } }).sort({ createdAt: -1 }).limit(5),
    ]);

    // Calculate metrics
    const totalStudents = students.length;
    const atRiskStudents = students.filter((s) => s.status === "At Risk" || (s.attendancePercentage && s.attendancePercentage < 75));
    const avgAttendance = totalStudents > 0
      ? Math.round(students.reduce((acc, s) => acc + (s.attendancePercentage || 85), 0) / totalStudents)
      : 84;
    const placedStudents = students.filter((s) => s.status === "Placed").length;

    res.status(200).json({
      success: true,
      dashboard: {
        college: college || { name: "Govt Engineering College", code: "GEC-01", isVerified: true },
        metrics: {
          totalStudents,
          atRiskCount: atRiskStudents.length,
          avgAttendance,
          placedCount: placedStudents,
          pendingApprovals: achievementsPending.length,
          activeDrives: activeDrives.length,
        },
        atRiskStudents: atRiskStudents.slice(0, 10),
        pendingAchievements: achievementsPending.slice(0, 10),
        recentStudents: students.slice(0, 10),
        activeDrives,
      },
    });
  } catch (error) {
    console.error("College dashboard error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark batch attendance
// @route   POST /api/college/attendance/batch
// @access  Private (College / Teacher)
const markBatchAttendance = async (req, res) => {
  try {
    const { subject, date = new Date(), semester, attendanceRecords } = req.body;

    if (!attendanceRecords || !Array.isArray(attendanceRecords)) {
      return res.status(400).json({ success: false, message: "Attendance records array is required" });
    }

    const recordsToInsert = attendanceRecords.map((r) => ({
      studentId: r.studentId,
      subject: subject || "Core Subject",
      date: new Date(date),
      status: r.status || "Present",
      semester: semester || 1,
      markedBy: req.user._id,
    }));

    await Attendance.insertMany(recordsToInsert);

    // Update students cached attendance percentage
    for (const record of attendanceRecords) {
      const allAtt = await Attendance.find({ studentId: record.studentId });
      const presentCount = allAtt.filter((a) => a.status === "Present").length;
      const pct = Math.round((presentCount / allAtt.length) * 100);

      await Student.findByIdAndUpdate(record.studentId, {
        attendancePercentage: pct,
        status: pct < 75 ? "At Risk" : "Active",
      });
    }

    res.status(201).json({
      success: true,
      message: `Batch attendance marked for ${attendanceRecords.length} students.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or Reject Achievement Proof
// @route   PATCH /api/college/achievements/:id/verify
// @access  Private (College / Teacher)
const verifyAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body; // "Approved" | "Rejected"

    const achievement = await Achievement.findById(id);
    if (!achievement) {
      return res.status(404).json({ success: false, message: "Achievement not found" });
    }

    achievement.status = status || "Approved";
    achievement.isVerified = status === "Approved";
    achievement.verifiedBy = req.user._id;
    if (rejectionReason) achievement.rejectionReason = rejectionReason;
    await achievement.save();

    // Create alert for student
    const student = await Student.findById(achievement.student || achievement.studentId);
    if (student && student.userId) {
      await Alert.create({
        userId: student.userId,
        role: "student",
        title: status === "Approved" ? "Achievement Verified! 🎉" : "Achievement Update",
        message: `Your submitted achievement "${achievement.title}" has been ${status.toLowerCase()} by college faculty.`,
        type: status === "Approved" ? "success" : "warning",
      });
    }

    res.status(200).json({
      success: true,
      message: `Achievement marked as ${achievement.status}`,
      achievement,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCollegeDashboard,
  markBatchAttendance,
  verifyAchievement,
};
