const Exam = require("../models/Exam");
const Student = require("../models/Student");

// @desc    Get all exams
// @route   GET /api/exams
// @access  Public
const getAllExams = async (req, res) => {
  try {
    const now = new Date();
    const exams = await Exam.find({
      isActive: true,
      examDate: { $gte: now },
    }).sort({ examDate: 1 });

    res.status(200).json({
      success: true,
      count: exams.length,
      exams,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get exams relevant to a student
// @route   GET /api/exams/student/:studentId
// @access  Public
const getStudentExams = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const now = new Date();

    // Find exams matching student's class and stream
    const exams = await Exam.find({
      isActive: true,
      examDate: { $gte: now },
      $or: [
        { applicableClasses: { $in: [student.currentClass] } },
        { applicableClasses: { $size: 0 } },
      ],
    }).sort({ examDate: 1 });

    // Filter by stream
    const filtered = exams.filter(
      (exam) =>
        exam.applicableStreams.length === 0 ||
        exam.applicableStreams.includes(student.stream) ||
        exam.applicableStreams.includes("Not Applicable")
    );

    // Add days remaining for each exam
    const examsWithDays = filtered.map((exam) => {
      const daysLeft = Math.ceil(
        (new Date(exam.examDate) - now) / (1000 * 60 * 60 * 24)
      );
      const regDaysLeft = exam.registrationDeadline
        ? Math.ceil(
            (new Date(exam.registrationDeadline) - now) /
              (1000 * 60 * 60 * 24)
          )
        : null;

      return {
        ...exam.toObject(),
        daysLeft,
        regDaysLeft,
        isUrgent: daysLeft <= 7,
        isRegistrationUrgent: regDaysLeft !== null && regDaysLeft <= 7,
      };
    });

    res.status(200).json({
      success: true,
      count: examsWithDays.length,
      exams: examsWithDays,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send exam reminders to all eligible students
// @route   POST /api/exams/send-reminders
// @access  Private (Teacher)
const sendExamReminders = async (req, res) => {
  try {
    const now = new Date();
    const exams = await Exam.find({
      isActive: true,
      examDate: { $gte: now },
    });

    let totalSent = 0;
    const results = [];

    for (const exam of exams) {
      const daysLeft = Math.ceil(
        (new Date(exam.examDate) - now) / (1000 * 60 * 60 * 24)
      );

      // Check if today is a reminder day
      if (!exam.reminderDays.includes(daysLeft)) continue;

      // Find eligible students
      const studentFilter = {};
      if (exam.applicableClasses.length > 0) {
        studentFilter.currentClass = { $in: exam.applicableClasses };
      }

      const students = await Student.find(studentFilter).populate(
        "familyContacts"
      );

      for (const student of students) {
        // Check stream match
        if (
          exam.applicableStreams.length > 0 &&
          !exam.applicableStreams.includes(student.stream) &&
          !exam.applicableStreams.includes("Not Applicable")
        ) {
          continue;
        }

        const message =
          `[VidyaMarg] ⚠️ EXAM REMINDER: ${exam.name} is in ${daysLeft} day(s). ` +
          `Date: ${new Date(exam.examDate).toLocaleDateString("en-IN")}. ` +
          (exam.registrationDeadline
            ? `Registration deadline: ${new Date(exam.registrationDeadline).toLocaleDateString("en-IN")}. `
            : "") +
          `Apply at: ${exam.applicationLink || "Contact school"}`;

        // Send to primary contact
        if (student.familyContacts && student.familyContacts.length > 0) {
          const primaryContact =
            student.familyContacts.find((c) => c.isPrimary) ||
            student.familyContacts[0];

          try {
            const twilio = require("twilio");
            const client = twilio(
              process.env.TWILIO_ACCOUNT_SID,
              process.env.TWILIO_AUTH_TOKEN
            );
            const digits = primaryContact.phoneNumber.replace(/\D/g, "");
            const formattedNumber =
              digits.length === 10 ? `+91${digits}` : `+${digits}`;

            await client.messages.create({
              body: message,
              from: process.env.TWILIO_PHONE_NUMBER,
              to: formattedNumber,
            });
            totalSent++;
          } catch (smsErr) {
            console.error("SMS failed:", smsErr.message);
          }
        }
      }

      results.push({
        exam: exam.name,
        daysLeft,
        studentsNotified: students.length,
      });
    }

    res.status(200).json({
      success: true,
      totalSent,
      results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllExams, getStudentExams, sendExamReminders };