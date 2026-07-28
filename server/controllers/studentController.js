const Student = require("../models/Student");
const FamilyContact = require("../models/FamilyContact");

// @desc    Register a new student
// @route   POST /api/students
// @access  Public
const registerStudent = async (req, res) => {
  try {
    const {
      name,
      gender,
      dateOfBirth,
      village,
      district,
      state,
      category,
      currentClass,
      stream,
      interestedField,
      contacts,
    } = req.body;

    // Step 1: Create the student document first (without contacts)
    const student = await Student.create({
      name,
      gender,
      dateOfBirth,
      village,
      district,
      state,
      category,
      currentClass,
      stream,
      interestedField,
    });

    // Step 2: Create each family contact linked to this student
    const contactDocs = await Promise.all(
      contacts.map((contact) =>
        FamilyContact.create({
          student: student._id,
          relation: contact.relation,
          name: contact.name,
          phoneNumber: contact.phoneNumber,
          isPrimary: contact.isPrimary,
        })
      )
    );

    // Step 3: Link the contact IDs back to the student
    student.familyContacts = contactDocs.map((c) => c._id);
    await student.save();

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const { calculateActivityScore } = require("../utils/activityScore");

// @desc    Get activity score breakdown for a student
// @route   GET /api/students/:id/score
// @access  Public
const getActivityScoreBreakdown = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const { score, breakdown } = await calculateActivityScore(student);

    // Update the score in DB
    student.activityScore = score;
    await student.save();

    res.status(200).json({
      success: true,
      score,
      breakdown,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Get all students
// @route   GET /api/students
// @access  Private (Teacher/Admin - will add auth later)
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("familyContacts");
    res.status(200).json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("familyContacts");
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Get alert count for this student
    const Alert = require("../models/Alert");
    const alertCount = await Alert.countDocuments({ student: req.params.id });

    res.status(200).json({
      success: true,
      student,
      alertCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get students filtered by status, village, district
// @route   GET /api/students/filter
// @access  Private
const getFilteredStudents = async (req, res) => {
  try {
    const {
      status,
      village,
      district,
      stream,
      category,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (village) filter.village = new RegExp(village, "i");
    if (district) filter.district = new RegExp(district, "i");
    if (stream) filter.stream = stream;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { village: new RegExp(search, "i") },
        { district: new RegExp(search, "i") },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Student.countDocuments(filter);
    const students = await Student.find(filter)
      .populate("familyContacts")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      students,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Get simplified parent dashboard data
// @route   GET /api/students/:id/parent-dashboard
// @access  Public
const getParentDashboard = async (req, res) => {
  try {
    const Student = require("../models/Student");
    const Progress = require("../models/Progress");
    const Certificate = require("../models/Certificate");
    const InterviewRequest = require("../models/InterviewRequest");

    const student = await Student.findById(req.params.id).populate(
      "familyContacts"
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Get latest progress record
    const latestProgress = await Progress.findOne({
      student: req.params.id,
    }).sort({ createdAt: -1 });

    // Get all progress records count
    const totalYears = await Progress.countDocuments({
      student: req.params.id,
    });

    // Get certificates
    const certificates = await Certificate.find({
      student: req.params.id,
    });

    // Get pending interviews
    const pendingInterviews = await InterviewRequest.find({
      student: req.params.id,
      status: "Pending",
    }).populate("company", "companyName");

    // Build simple status
    const statusInfo = {
      Active: {
        emoji: "🟢",
        color: "green",
        message: "Studying well",
        hindiMessage: "पढ़ाई अच्छी चल रही है",
      },
      "At Risk": {
        emoji: "🟡",
        color: "yellow",
        message: "Needs attention",
        hindiMessage: "ध्यान देने की जरूरत है",
      },
      Dropout: {
        emoji: "🔴",
        color: "red",
        message: "Not studying — contact school",
        hindiMessage: "पढ़ाई नहीं — स्कूल से संपर्क करें",
      },
      Placed: {
        emoji: "🎉",
        color: "blue",
        message: "Got a job!",
        hindiMessage: "नौकरी मिल गई!",
      },
      Graduated: {
        emoji: "🎓",
        color: "purple",
        message: "Graduated successfully",
        hindiMessage: "सफलतापूर्वक स्नातक हुए",
      },
    };

    const currentStatus =
      statusInfo[student.status] || statusInfo["Active"];

    res.status(200).json({
      success: true,
      dashboard: {
        student: {
          name: student.name,
          village: student.village,
          currentClass: student.currentClass,
          status: student.status,
          activityScore: student.activityScore,
        },
        statusInfo: currentStatus,
        latestProgress: latestProgress
          ? {
            className: latestProgress.className,
            academicYear: latestProgress.academicYear,
            marksPercentage: latestProgress.marksPercentage,
            result: latestProgress.result,
            attendancePercentage: latestProgress.attendancePercentage,
          }
          : null,
        stats: {
          yearsStudied: totalYears,
          certificatesEarned: certificates.length,
          pendingInterviews: pendingInterviews.length,
        },
        pendingInterviews: pendingInterviews.map((i) => ({
          company: i.company?.companyName,
          jobTitle: i.jobTitle,
          id: i._id,
        })),
        familyContacts: student.familyContacts?.map((c) => ({
          name: c.name,
          relation: c.relation,
          phone: c.phoneNumber,
          isPrimary: c.isPrimary,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Find student by family contact phone number
// @route   GET /api/students/find-by-phone/:phone
// @access  Public
const findByPhone = async (req, res) => {
  try {
    const FamilyContact = require("../models/FamilyContact");
    const contact = await FamilyContact.findOne({
      phoneNumber: req.params.phone,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "No student found with this phone number",
      });
    }

    const student = await Student.findById(contact.student).populate(
      "familyContacts"
    );

    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  registerStudent,
  getAllStudents,
  getStudentById,
  getFilteredStudents,
  getActivityScoreBreakdown,
  getParentDashboard,
  findByPhone,
};

