const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const ExamResult = require("../models/ExamResult");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Interview = require("../models/Interview");
const Achievement = require("../models/Achievement");
const Certificate = require("../models/Certificate");
const Alert = require("../models/Alert");

// Helper: calculate Career Readiness Score (0 - 100)
const computeReadinessScore = (student, attendanceList, examResults, achievements, certificates) => {
  let score = 0;

  // 1. Academic Performance (Max 30 pts)
  const cgpa = student.cgpa || 7.0;
  score += Math.min(30, Math.round((cgpa / 10) * 30));

  // 2. Attendance Health (Max 20 pts)
  let attPct = student.attendancePercentage || 85;
  if (attendanceList.length > 0) {
    const presentCount = attendanceList.filter((a) => a.status === "Present").length;
    attPct = Math.round((presentCount / attendanceList.length) * 100);
  }
  score += Math.min(20, Math.round((attPct / 100) * 20));

  // 3. Skills & Certifications (Max 25 pts)
  const skillsCount = (student.skills || []).length;
  const certCount = certificates.length;
  const skillPoints = Math.min(15, skillsCount * 3);
  const certPoints = Math.min(10, certCount * 5);
  score += skillPoints + certPoints;

  // 4. Achievements & Co-curricular (Max 25 pts)
  const approvedAchievements = achievements.filter((a) => a.status === "Approved" || a.isVerified);
  score += Math.min(25, approvedAchievements.length * 8 + achievements.length * 2);

  return Math.min(100, Math.max(20, score));
};

// @desc    Get Student Dashboard Overview
// @route   GET /api/student/dashboard
// @access  Private (Student)
const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    let student = await Student.findOne({ userId });

    // Fallback if not linked by userId yet
    if (!student) {
      student = await Student.findOne({ email: req.user.email }) || await Student.findOne();
    }

    if (!student) {
      return res.status(404).json({ success: false, message: "Student record not found" });
    }

    // Parallel fetch related data
    const [
      attendanceList,
      examResults,
      applications,
      interviews,
      achievements,
      certificates,
      alerts,
      recommendedJobs,
    ] = await Promise.all([
      Attendance.find({ studentId: student._id }).sort({ date: -1 }).limit(30),
      ExamResult.find({ studentId: student._id }).sort({ semester: -1 }),
      Application.find({ studentId: student._id }).populate("jobId").sort({ appliedAt: -1 }),
      Interview.find({ studentId: student._id }).populate("jobId companyId").sort({ date: 1 }),
      Achievement.find({ $or: [{ studentId: student._id }, { student: student._id }] }),
      Certificate.find({ student: student._id }),
      Alert.find({ $or: [{ userId }, { role: "student" }, { role: "all" }] }).sort({ createdAt: -1 }).limit(10),
      Job.find({ status: "Active" }).populate("companyId", "companyName logo location industryType").sort({ createdAt: -1 }).limit(5),
    ]);

    // Calculate dynamic readiness score
    const readinessScore = computeReadinessScore(
      student,
      attendanceList,
      examResults,
      achievements,
      certificates
    );

    // Update readiness score on student if changed
    if (student.careerReadinessScore !== readinessScore) {
      student.careerReadinessScore = readinessScore;
      await student.save();
    }

    // Calculate attendance percentage
    const totalDays = attendanceList.length;
    const presentDays = attendanceList.filter((a) => a.status === "Present").length;
    const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : student.attendancePercentage || 85;

    res.status(200).json({
      success: true,
      dashboard: {
        student,
        metrics: {
          readinessScore,
          attendanceRate,
          cgpa: student.cgpa || 7.8,
          activeApplications: applications.length,
          upcomingInterviews: interviews.filter((i) => i.status === "Scheduled").length,
          totalCertificates: certificates.length,
          approvedAchievements: achievements.filter((a) => a.status === "Approved").length,
        },
        recentAttendance: attendanceList.slice(0, 7),
        recentExams: examResults.slice(0, 5),
        applications,
        upcomingInterviews: interviews.slice(0, 3),
        alerts,
        recommendedJobs,
      },
    });
  } catch (error) {
    console.error("Student dashboard error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply for a Job / Drive
// @route   POST /api/student/jobs/:id/apply
// @access  Private (Student)
const applyForJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user._id;
    let student = await Student.findOne({ userId }) || await Student.findOne({ email: req.user.email });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student profile required to apply" });
    }

    const job = await Job.findById(jobId);
    if (!job || job.status !== "Active") {
      return res.status(400).json({ success: false, message: "This job is no longer active" });
    }

    // Check duplicate
    const existingApp = await Application.findOne({ jobId, studentId: student._id });
    if (existingApp) {
      return res.status(400).json({ success: false, message: "You have already applied for this position" });
    }

    const application = await Application.create({
      jobId,
      studentId: student._id,
      companyId: job.companyId,
      status: "Applied",
      appliedAt: new Date(),
    });

    // Increment job applicant count
    job.applicantsCount = (job.applicantsCount || 0) + 1;
    await job.save();

    // Create confirmation alert
    await Alert.create({
      userId,
      role: "student",
      title: "Application Submitted",
      message: `Your application for ${job.title} has been received by the recruiter.`,
      type: "success",
      link: "/student/applications",
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit new Achievement with proof
// @route   POST /api/student/achievements
// @access  Private (Student)
const submitAchievement = async (req, res) => {
  try {
    const userId = req.user._id;
    let student = await Student.findOne({ userId }) || await Student.findOne({ email: req.user.email });

    const { title, category, description, proofUrl, level, position } = req.body;

    const achievement = await Achievement.create({
      student: student._id,
      studentId: student._id,
      title,
      category: category || "Academic",
      description,
      proofUrl,
      level: level || "College",
      position: position || "Participant",
      status: "Pending",
      isVerified: false,
    });

    res.status(201).json({
      success: true,
      message: "Achievement submitted for college approval!",
      achievement,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStudentDashboard,
  applyForJob,
  submitAchievement,
};
