const Certificate = require("../models/Certificate");
const Student = require("../models/Student");
const Progress = require("../models/Progress");
const { updateStudentActivityScore } = require("../utils/activityScore");

// @desc    Issue a certificate to a student
// @route   POST /api/certificates
// @access  Private (Teacher)
const issueCertificate = async (req, res) => {
  try {
    const { studentId, type, title, description, academicYear } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const certificate = await Certificate.create({
      student: studentId,
      type,
      title,
      description,
      academicYear,
    });

    
    // Update student activity score
    await updateStudentActivityScore(student);

    res.status(201).json({
      success: true,
      message: "Certificate issued successfully",
      certificate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all certificates for a student
// @route   GET /api/certificates/:studentId
// @access  Public
const getStudentCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({
      student: req.params.studentId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: certificates.length,
      certificates,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auto-generate certificates based on leaderboard
// @route   POST /api/certificates/auto-generate
// @access  Private (Teacher)
const autoGenerateCertificates = async (req, res) => {
  try {
    const { academicYear } = req.body;

    if (!academicYear) {
      return res.status(400).json({
        success: false,
        message: "Academic year is required",
      });
    }

    const generated = [];

    // Find class toppers from progress records
    const progressRecords = await Progress.find({ academicYear })
      .populate("student")
      .sort({ marksPercentage: -1 });

    const classToppers = {};
    for (const record of progressRecords) {
      if (!record.marksPercentage || !record.student) continue;
      const className = record.className;

      if (!classToppers[className]) {
        classToppers[className] = record;

        // Check if certificate already exists
        const existing = await Certificate.findOne({
          student: record.student._id,
          type: "ClassTopper",
          academicYear,
        });

        if (!existing) {
          const cert = await Certificate.create({
            student: record.student._id,
            type: "ClassTopper",
            title: `Class ${className} Topper`,
            description: `Achieved highest marks of ${record.marksPercentage}% in ${className} for the academic year ${academicYear}`,
            academicYear,
          });

        await updateStudentActivityScore(record.student);

          generated.push(cert);
        }
      }
    }

    // Consistent Learner — students with 3+ progress records all Pass
    const allStudents = await Student.find({});
    for (const student of allStudents) {
      const records = await Progress.find({ student: student._id });
      const allPass = records.every((r) => r.result === "Pass");

      if (records.length >= 3 && allPass) {
        const existing = await Certificate.findOne({
          student: student._id,
          type: "ConsistentLearner",
        });

        if (!existing) {
          const cert = await Certificate.create({
            student: student._id,
            type: "ConsistentLearner",
            title: "Consistent Learner Award",
            description: `Passed all ${records.length} academic years without any failure`,
            academicYear,
          });

          await updateStudentActivityScore(student);
          generated.push(cert);
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `${generated.length} certificates generated`,
      generated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a certificate
// @route   DELETE /api/certificates/:certificateId
// @access  Private
const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(
      req.params.certificateId
    );
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }
    res.status(200).json({ success: true, message: "Certificate deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  issueCertificate,
  getStudentCertificates,
  autoGenerateCertificates,
  deleteCertificate,
};