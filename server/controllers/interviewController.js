const InterviewRequest = require("../models/InterviewRequest");
const Student = require("../models/Student");
const Company = require("../models/Company");
const { sendAlertToFamily } = require("../utils/alertService");

// @desc    Send interview request to a student
// @route   POST /api/interviews
// @access  Private (Company)
const sendInterviewRequest = async (req, res) => {
  try {
    const { studentId, jobTitle, jobDescription, salary, interviewDate } =
      req.body;

    const companyId = req.company._id;

    // Check if student exists
    const student = await Student.findById(studentId).populate(
      "familyContacts"
    );
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if request already exists
    const existing = await InterviewRequest.findOne({
      company: companyId,
      student: studentId,
      status: { $in: ["Pending", "Accepted"] },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Interview request already sent to this student",
      });
    }

    // Get company details
    const company = await Company.findById(companyId);

    // Create interview request
    const interviewRequest = await InterviewRequest.create({
      company: companyId,
      student: studentId,
      jobTitle,
      status: "Pending",
    });

    // Send alert to all family contacts
    if (student.familyContacts && student.familyContacts.length > 0) {
      const message =
        `[VidyaMarg] 🎉 OPPORTUNITY: ${student.name} has received an interview call from ${company.companyName} for ${jobTitle}. ` +
        `Salary: ${salary || "Not specified"}. ` +
        `Please respond via VidyaMarg app. Certificate No: ${interviewRequest._id}`;

      // Send SMS to all contacts
      for (const contact of student.familyContacts) {
        try {
          const twilio = require("twilio");
          const client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
          );
          const digits = contact.phoneNumber.replace(/\D/g, "");
          const formattedNumber =
            digits.length === 10 ? `+91${digits}` : `+${digits}`;

          await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: formattedNumber,
          });
        } catch (smsError) {
          console.error(
            `SMS failed to ${contact.phoneNumber}:`,
            smsError.message
          );
        }
      }
    }

    // Update student status to show they have an opportunity
    if (student.status === "Active") {
      student.activityScore = Math.min(student.activityScore + 5, 100);
      await student.save();
    }

    res.status(201).json({
      success: true,
      message: "Interview request sent successfully",
      interviewRequest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all interview requests for a student
// @route   GET /api/interviews/student/:studentId
// @access  Public
const getStudentInterviews = async (req, res) => {
  try {
    const interviews = await InterviewRequest.find({
      student: req.params.studentId,
    })
      .populate("company", "companyName location industryType phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all interview requests sent by a company
// @route   GET /api/interviews/company
// @access  Private (Company)
const getCompanyInterviews = async (req, res) => {
  try {
    const interviews = await InterviewRequest.find({
      company: req.company._id,
    })
      .populate("student", "name village district currentClass activityScore status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update interview request status (Accept/Reject)
// @route   PUT /api/interviews/:id
// @access  Public (Student updates their own)
const updateInterviewStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Accepted", "Rejected", "Interviewed", "Hired"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const interview = await InterviewRequest.findById(req.params.id)
      .populate("company", "companyName")
      .populate("student");

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview request not found",
      });
    }

    const oldStatus = interview.status;
    interview.status = status;
    await interview.save();

    // If student is Hired — update their status
    if (status === "Hired") {
      const student = await Student.findById(interview.student._id);
      if (student) {
        student.status = "Placed";
        student.activityScore = Math.min(student.activityScore + 20, 100);
        await student.save();
      }
    }

    res.status(200).json({
      success: true,
      message: `Interview request ${status.toLowerCase()} successfully`,
      interview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get interview stats for teacher dashboard
// @route   GET /api/interviews/stats
// @access  Private (Teacher)
const getInterviewStats = async (req, res) => {
  try {
    const total = await InterviewRequest.countDocuments();
    const pending = await InterviewRequest.countDocuments({
      status: "Pending",
    });
    const accepted = await InterviewRequest.countDocuments({
      status: "Accepted",
    });
    const hired = await InterviewRequest.countDocuments({ status: "Hired" });
    const rejected = await InterviewRequest.countDocuments({
      status: "Rejected",
    });

    res.status(200).json({
      success: true,
      stats: { total, pending, accepted, hired, rejected },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  sendInterviewRequest,
  getStudentInterviews,
  getCompanyInterviews,
  updateInterviewStatus,
  getInterviewStats,
};