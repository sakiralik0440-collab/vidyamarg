const GovtScheme = require("../models/GovtScheme");
const Student = require("../models/Student");

// @desc    Get all active govt schemes
// @route   GET /api/schemes
// @access  Public
const getAllSchemes = async (req, res) => {
  try {
    const schemes = await GovtScheme.find({ isActive: true }).sort({
      isNew: -1,
      createdAt: -1,
    });
    res.status(200).json({ success: true, count: schemes.length, schemes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get schemes matching student profile
// @route   POST /api/schemes/match
// @access  Public
const matchSchemes = async (req, res) => {
  try {
    const { category, age, gender, state } = req.body;
    const schemes = await GovtScheme.find({ isActive: true });

    const matched = schemes.filter((scheme) => {
      const e = scheme.eligibility;
      if (e.categories.length > 0 && !e.categories.includes(category))
        return false;
      if (e.gender !== "Any" && e.gender !== gender) return false;
      if (e.states.length > 0 && !e.states.includes(state)) return false;
      if (age && e.minAge && age < e.minAge) return false;
      if (age && e.maxAge && age > e.maxAge) return false;
      return true;
    });

    res.status(200).json({
      success: true,
      count: matched.length,
      schemes: matched,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send auto-alerts for new schemes to eligible students
// @route   POST /api/schemes/send-alerts
// @access  Private (Teacher)
const sendSchemeAlerts = async (req, res) => {
  try {
    const newSchemes = await GovtScheme.find({
      isNew: true,
      isActive: true,
      alertSent: false,
    });

    if (newSchemes.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No new schemes to alert about",
      });
    }

    let totalAlerted = 0;

    for (const scheme of newSchemes) {
      const studentFilter = {};
      if (scheme.eligibility.categories.length > 0) {
        studentFilter.category = { $in: scheme.eligibility.categories };
      }

      const students = await Student.find(studentFilter).populate(
        "familyContacts"
      );

      for (const student of students) {
        if (!student.familyContacts || student.familyContacts.length === 0)
          continue;

        const primaryContact =
          student.familyContacts.find((c) => c.isPrimary) ||
          student.familyContacts[0];

        const message =
          `[VidyaMarg] 🆕 NEW SCHEME: ${scheme.name}\n` +
          `Benefit: ${scheme.benefit}\n` +
          `Apply at: ${scheme.applicationLink || "Contact school"}\n` +
          (scheme.deadline
            ? `Deadline: ${new Date(scheme.deadline).toLocaleDateString("en-IN")}`
            : "No deadline — apply anytime");

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
          totalAlerted++;
        } catch (smsErr) {
          console.error("SMS failed:", smsErr.message);
        }
      }

      // Mark as alerted
      scheme.alertSent = true;
      await scheme.save();
    }

    res.status(200).json({
      success: true,
      schemesAlerted: newSchemes.length,
      studentsAlerted: totalAlerted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllSchemes, matchSchemes, sendSchemeAlerts };