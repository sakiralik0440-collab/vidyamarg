const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Interview = require("../models/Interview");
const Student = require("../models/Student");
const Alert = require("../models/Alert");

// @desc    Get Company Dashboard metrics
// @route   GET /api/company/dashboard
// @access  Private (Company)
const getCompanyDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    let company = await Company.findOne({ $or: [{ userId }, { email: req.user.email }] });
    if (!company) company = await Company.findOne();

    const companyId = company ? company._id : null;

    const [jobs, applications, interviews] = await Promise.all([
      Job.find({ companyId }).sort({ createdAt: -1 }),
      Application.find({ companyId }).populate("studentId jobId").sort({ appliedAt: -1 }),
      Interview.find({ companyId }).populate("studentId jobId").sort({ date: 1 }),
    ]);

    // Metric counts
    const activeJobs = jobs.filter((j) => j.status === "Active").length;
    const totalApplications = applications.length;
    const shortlistedCount = applications.filter((a) => a.status === "Shortlisted").length;
    const scheduledInterviews = interviews.filter((i) => i.status === "Scheduled").length;
    const hiredCount = applications.filter((a) => a.status === "Selected").length;

    res.status(200).json({
      success: true,
      dashboard: {
        company,
        metrics: {
          activeJobs,
          totalApplications,
          shortlistedCount,
          scheduledInterviews,
          hiredCount,
        },
        jobs,
        recentApplications: applications.slice(0, 10),
        upcomingInterviews: interviews.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("Company dashboard error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Post a new Job / Campus Drive
// @route   POST /api/company/jobs
// @access  Private (Company)
const createJobPosting = async (req, res) => {
  try {
    const userId = req.user._id;
    let company = await Company.findOne({ $or: [{ userId }, { email: req.user.email }] });
    if (!company) company = await Company.findOne();

    const {
      title,
      description,
      jobType = "Full-time",
      ctc,
      location,
      skillsRequired,
      requirements,
      minCgpa = 6.0,
      minActivityScore = 40,
      eligibleBranches,
      deadline,
    } = req.body;

    const job = await Job.create({
      companyId: company._id,
      title,
      description,
      jobType,
      ctc,
      location,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : (skillsRequired || "").split(",").map((s) => s.trim()),
      requirements: Array.isArray(requirements) ? requirements : (requirements || "").split("\n").map((r) => r.trim()),
      minCgpa,
      minActivityScore,
      eligibleBranches: Array.isArray(eligibleBranches) ? eligibleBranches : (eligibleBranches || "").split(",").map((b) => b.trim()),
      deadline: deadline ? new Date(deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "Active",
    });

    res.status(201).json({
      success: true,
      message: "Job posting published successfully!",
      job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search candidate talent pool
// @route   GET /api/company/candidates
// @access  Private (Company)
const searchCandidates = async (req, res) => {
  try {
    const { minCgpa, minReadiness, skill, branch } = req.query;

    const query = { status: { $ne: "Dropout" } };
    if (minCgpa) query.cgpa = { $gte: Number(minCgpa) };
    if (minReadiness) query.careerReadinessScore = { $gte: Number(minReadiness) };
    if (branch) query.stream = branch;
    if (skill) query.skills = { $regex: new RegExp(skill, "i") };

    const candidates = await Student.find(query).limit(20);

    res.status(200).json({
      success: true,
      count: candidates.length,
      candidates,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Schedule interview with candidate
// @route   POST /api/company/interviews/schedule
// @access  Private (Company)
const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, round, date, time, meetingLink, location } = req.body;

    const application = await Application.findById(applicationId).populate("studentId jobId");
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const interview = await Interview.create({
      applicationId: application._id,
      jobId: application.jobId._id,
      companyId: application.companyId,
      studentId: application.studentId._id,
      round: round || "Technical Round 1",
      date: new Date(date),
      time: time || "11:00 AM",
      meetingLink: meetingLink || "https://meet.google.com/new",
      location: location || "Online Video Call",
      status: "Scheduled",
    });

    // Update application status
    application.status = "Interview Scheduled";
    await application.save();

    // Alert candidate
    if (application.studentId.userId) {
      await Alert.create({
        userId: application.studentId.userId,
        role: "student",
        title: "Interview Scheduled! 📅",
        message: `You have been invited for ${interview.round} for position: ${application.jobId.title} on ${new Date(date).toLocaleDateString()} at ${time}.`,
        type: "success",
        link: "/student/interviews",
      });
    }

    res.status(201).json({
      success: true,
      message: "Interview scheduled successfully and invitation alert sent to candidate.",
      interview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCompanyDashboard,
  createJobPosting,
  searchCandidates,
  scheduleInterview,
};
