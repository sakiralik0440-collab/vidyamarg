const jwt = require("jsonwebtoken");
const Company = require("../models/Company");
const Student = require("../models/Student");

// Generate JWT token for company
const generateCompanyToken = (id) => {
  return jwt.sign({ id, type: "company" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// @desc    Register a new company
// @route   POST /api/company/register
// @access  Public
const registerCompany = async (req, res) => {
  try {
    const {
      companyName,
      email,
      password,
      location,
      district,
      state,
      industryType,
      phone,
      website,
      description,
    } = req.body;

    // Check if company already exists
    const existing = await Company.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A company with this email already exists",
      });
    }

    const company = await Company.create({
      companyName,
      email,
      password,
      location,
      district,
      state,
      industryType,
      phone,
      website,
      description,
    });

    const token = generateCompanyToken(company._id);

    res.status(201).json({
      success: true,
      message: "Company registered successfully",
      token,
      company: {
        id: company._id,
        companyName: company.companyName,
        email: company.email,
        location: company.location,
        industryType: company.industryType,
        isVerified: company.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login company
// @route   POST /api/company/login
// @access  Public
const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await company.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateCompanyToken(company._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      company: {
        id: company._id,
        companyName: company.companyName,
        email: company.email,
        location: company.location,
        industryType: company.industryType,
        isVerified: company.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get company profile
// @route   GET /api/company/me
// @access  Private (Company)
const getCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findById(req.company._id).select("-password");
    res.status(200).json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search students by activity score and qualifications
// @route   GET /api/company/search-students
// @access  Private (Company)
const searchStudents = async (req, res) => {
  try {
    const {
      minActivityScore = 0,
      minMarks,
      stream,
      category,
      district,
      state,
      status = "Active",
    } = req.query;

    const filter = {};

    // Only show Active, Graduated, or Placed students
    filter.status = { $in: ["Active", "Graduated", "Placed"] };
    if (status && status !== "all") filter.status = status;

    // Activity score filter
    filter.activityScore = { $gte: Number(minActivityScore) };

    // Location filters
    if (district) filter.district = new RegExp(district, "i");
    else if (state) filter.state = new RegExp(state, "i");

    if (stream && stream !== "Not Applicable") filter.stream = stream;
    if (category) filter.category = category;

    const students = await Student.find(filter)
      .select("-familyContacts")
      .sort({ activityScore: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Post a new job
// @route   POST /api/company/jobs
// @access  Private (Company)
const postJob = async (req, res) => {
  try {
    const { title, description, salary, minMarks, minActivityScore, stream } =
      req.body;

    const company = await Company.findById(req.company._id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    company.jobsPosted.push({
      title,
      description,
      salary,
      minMarks,
      minActivityScore,
      stream,
    });

    await company.save();

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job: company.jobsPosted[company.jobsPosted.length - 1],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all active jobs from all companies
// @route   GET /api/company/jobs
// @access  Public
const getAllJobs = async (req, res) => {
  try {
    const companies = await Company.find({
      "jobsPosted.isActive": true,
    }).select("companyName location industryType jobsPosted");

    const jobs = [];
    companies.forEach((company) => {
      company.jobsPosted
        .filter((job) => job.isActive)
        .forEach((job) => {
          jobs.push({
            ...job.toObject(),
            companyName: company.companyName,
            companyLocation: company.location,
            companyId: company._id,
          });
        });
    });

    // Sort by newest first
    jobs.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Get jobs matching a student's profile
// @route   POST /api/company/jobs/match
// @access  Public
const getMatchingJobs = async (req, res) => {
  try {
    const { activityScore, marksPercentage, stream } = req.body;

    const companies = await Company.find({
      "jobsPosted.isActive": true,
    }).select("companyName location industryType phone jobsPosted isVerified");

    const matchingJobs = [];

    companies.forEach((company) => {
      company.jobsPosted
        .filter((job) => job.isActive)
        .forEach((job) => {
          let qualifies = true;
          let matchScore = 50; // base score

          // Check activity score requirement
          if (
            job.minActivityScore &&
            activityScore < job.minActivityScore
          ) {
            qualifies = false;
          }

          // Check marks requirement
          if (job.minMarks && marksPercentage < job.minMarks) {
            qualifies = false;
          }

          // Check stream requirement
          if (
            job.stream &&
            job.stream !== "" &&
            stream !== job.stream &&
            stream !== "Not Applicable"
          ) {
            matchScore -= 20;
          }

          // Boost match score based on how well student qualifies
          if (activityScore >= (job.minActivityScore || 0) + 20)
            matchScore += 30;
          else if (activityScore >= (job.minActivityScore || 0))
            matchScore += 15;

          if (qualifies) {
            matchingJobs.push({
              ...job.toObject(),
              companyName: company.companyName,
              companyLocation: company.location,
              companyIndustry: company.industryType,
              companyPhone: company.phone,
              companyId: company._id,
              isVerified: company.isVerified,
              matchScore: Math.min(matchScore, 100),
            });
          }
        });
    });

    // Sort by match score
    matchingJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      count: matchingJobs.length,
      jobs: matchingJobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerCompany,
  loginCompany,
  getCompanyProfile,
  searchStudents,
  postJob,
  getAllJobs,
  getMatchingJobs,
};