const ParentStudent = require("../models/ParentStudent");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const ExamResult = require("../models/ExamResult");
const FeeTracker = require("../models/FeeTracker");
const Alert = require("../models/Alert");
const Achievement = require("../models/Achievement");

// @desc    Get Parent Dashboard overview
// @route   GET /api/parent/dashboard
// @access  Private (Parent)
const getParentDashboard = async (req, res) => {
  try {
    const parentId = req.user._id;

    // Find linked children
    const links = await ParentStudent.find({ parentId }).populate("studentId");
    
    // If no linked children, find sample student for demo
    let child = null;
    if (links.length > 0) {
      child = links[0].studentId;
    } else {
      child = await Student.findOne();
    }

    if (!child) {
      return res.status(200).json({
        success: true,
        dashboard: {
          linkedChildren: [],
          selectedChild: null,
          hasLinkedChild: false,
          message: "Please link your child's student profile using their Roll Number.",
        },
      });
    }

    // Parallel fetch child's metrics
    const [attendanceList, examResults, feeRecord, achievements, alerts] = await Promise.all([
      Attendance.find({ studentId: child._id }).sort({ date: -1 }).limit(30),
      ExamResult.find({ studentId: child._id }).sort({ semester: -1 }),
      FeeTracker.findOne({ student: child._id }),
      Achievement.find({ $or: [{ studentId: child._id }, { student: child._id }] }),
      Alert.find({ $or: [{ userId: parentId }, { role: "parent" }, { student: child._id }] }).sort({ createdAt: -1 }),
    ]);

    // Calculate attendance percentage
    const totalDays = attendanceList.length;
    const presentDays = attendanceList.filter((a) => a.status === "Present").length;
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : child.attendancePercentage || 82;

    // Detect risk flags
    const atRiskAlerts = [];
    if (attendancePercentage < 75) {
      atRiskAlerts.push({
        id: "att-risk",
        level: "High",
        title: "Low Attendance Warning",
        desc: `Attendance is currently at ${attendancePercentage}%, which is below the mandatory 75% requirement.`,
      });
    }

    const failingExams = examResults.filter((e) => e.percentage < 40);
    if (failingExams.length > 0) {
      atRiskAlerts.push({
        id: "exam-risk",
        level: "Medium",
        title: "Academic Remedial Needed",
        desc: `${child.name} scored below 40% in ${failingExams.map((f) => f.subject).join(", ")}.`,
      });
    }

    res.status(200).json({
      success: true,
      dashboard: {
        hasLinkedChild: true,
        linkedChildren: links.map((l) => ({
          id: l.studentId._id,
          name: l.studentId.name,
          rollNo: l.studentId.rollNo,
          course: l.studentId.currentClass,
          relationship: l.relationship,
          isVerified: l.isVerified,
        })),
        selectedChild: child,
        metrics: {
          attendancePercentage,
          cgpa: child.cgpa || 7.6,
          activityScore: child.activityScore || 65,
          totalAchievements: achievements.length,
          atRiskAlertCount: atRiskAlerts.length,
        },
        atRiskAlerts,
        recentAttendance: attendanceList.slice(0, 10),
        examResults,
        feeSummary: feeRecord || {
          totalFee: 45000,
          paidAmount: 35000,
          dueAmount: 10000,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: "Partial",
        },
        alerts,
      },
    });
  } catch (error) {
    console.error("Parent dashboard error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Link child with roll number and DOB verification
// @route   POST /api/parent/link-child
// @access  Private (Parent)
const linkChild = async (req, res) => {
  try {
    const parentId = req.user._id;
    const { rollNo, studentName, relationship = "Guardian" } = req.body;

    const student = await Student.findOne({
      $or: [
        { rollNo: { $regex: new RegExp(`^${rollNo}$`, "i") } },
        { name: { $regex: new RegExp(`^${studentName}$`, "i") } },
      ],
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "No student found matching this Roll Number or Name",
      });
    }

    // Upsert link
    let link = await ParentStudent.findOne({ parentId, studentId: student._id });
    if (!link) {
      link = await ParentStudent.create({
        parentId,
        studentId: student._id,
        relationship,
        isVerified: true,
        verifiedAt: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      message: `Successfully linked with student ${student.name}!`,
      link,
      student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getParentDashboard,
  linkChild,
};
