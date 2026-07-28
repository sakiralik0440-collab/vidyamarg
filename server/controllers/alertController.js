const Student = require("../models/Student");
const FamilyContact = require("../models/FamilyContact");
const Alert = require("../models/Alert");
const {
  sendAlertToFamily,
  sendAlertToPrimary,
} = require("../utils/alertService");

// @desc    Send manual alert to a student's family
// @route   POST /api/alerts/send
// @access  Private (Teacher)
const sendManualAlert = async (req, res) => {
  try {
    const {
      studentId,
      alertType,
      language,
      templateArgs,
      useWhatsApp,
      sendToAll,
    } = req.body;

    // Fetch student with contacts
    const student = await Student.findById(studentId).populate("familyContacts");
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (!student.familyContacts || student.familyContacts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No family contacts found for this student",
      });
    }

    let result;
    if (sendToAll) {
      result = await sendAlertToFamily(
        student.familyContacts,
        alertType,
        language || "en",
        templateArgs || [student.name],
        useWhatsApp || false
      );
    } else {
      result = await sendAlertToPrimary(
        student.familyContacts,
        alertType,
        language || "en",
        templateArgs || [student.name]
      );
    }

    // Save alert record to DB
    await Alert.create({
      student: studentId,
      sentBy: req.teacher._id,
      alertType,
      message: result.message,
      recipientCount: result.successCount || 1,
      channel: useWhatsApp ? "whatsapp" : "sms",
    });

    res.status(200).json({
      success: true,
      message: "Alert sent successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send automatic dropout alert to at-risk students
// @route   POST /api/alerts/auto-dropout
// @access  Private (Teacher/Admin)
const sendAutoDropoutAlerts = async (req, res) => {
  try {
    const { language = "en" } = req.body;

    // Find all at-risk and dropout students
    const atRiskStudents = await Student.find({
      status: { $in: ["At Risk", "Dropout"] },
    }).populate("familyContacts");

    let totalSent = 0;
    let totalFailed = 0;
    const results = [];

    for (const student of atRiskStudents) {
      if (!student.familyContacts || student.familyContacts.length === 0) continue;

      const alertType = student.status === "Dropout" ? "dropoutConfirmed" : "dropoutRisk";

      const result = await sendAlertToFamily(
        student.familyContacts,
        alertType,
        language,
        [student.name]
      );

      totalSent += result.successCount || 0;
      totalFailed += (result.totalContacts || 0) - (result.successCount || 0);

      results.push({
        student: student.name,
        status: student.status,
        contactsAlerted: result.successCount,
      });

      // Save alert record
      await Alert.create({
        student: student._id,
        alertType,
        message: result.message,
        recipientCount: result.successCount,
        channel: "sms",
        isAutomatic: true,
      });
    }

    res.status(200).json({
      success: true,
      totalStudentsAlerted: atRiskStudents.length,
      totalMessagesSent: totalSent,
      totalFailed,
      results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get alert history for a student
// @route   GET /api/alerts/:studentId
// @access  Private
const getAlertHistory = async (req, res) => {
  try {
    const alerts = await Alert.find({ student: req.params.studentId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send custom message to student's family
// @route   POST /api/alerts/custom
// @access  Private (Teacher)
const sendCustomAlert = async (req, res) => {
  try {
    const {
      studentId,
      customMessage,
      language,
      sendToAll,
      useWhatsApp,
    } = req.body;

    if (!customMessage || customMessage.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Custom message cannot be empty",
      });
    }

    const student = await Student.findById(studentId).populate("familyContacts");
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!student.familyContacts || student.familyContacts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No family contacts found",
      });
    }

    // Build custom message using template
    const { getTemplate } = require("../utils/alertTemplates");
    const message = getTemplate(
      "custom",
      language || "en",
      student.name,
      customMessage
    );

    const { sendAlertToFamily, sendAlertToPrimary } = require("../utils/alertService");

    let result;
    if (sendToAll) {
      // Manually send since we have a custom message not from template
      const results = [];
      const { sendSMS, sendWhatsApp } = require("../utils/alertService");

      for (const contact of student.familyContacts) {
        let sendResult;
        if (useWhatsApp) {
          sendResult = await sendWhatsApp(contact.phoneNumber, message);
        } else {
          sendResult = await sendSMS(contact.phoneNumber, message);
        }
        results.push({
          contact: contact.name,
          phone: contact.phoneNumber,
          ...sendResult,
        });
      }

      const successCount = results.filter((r) => r.success).length;
      result = { success: true, message, results, successCount, totalContacts: student.familyContacts.length };
    } else {
      const primaryContact = student.familyContacts.find((c) => c.isPrimary) || student.familyContacts[0];
      const { sendSMS } = require("../utils/alertService");
      const sendResult = await sendSMS(primaryContact.phoneNumber, message);
      result = { ...sendResult, message, successCount: sendResult.success ? 1 : 0 };
    }

    // Save to alert history
    await Alert.create({
      student: studentId,
      sentBy: req.teacher._id,
      alertType: "custom",
      message,
      recipientCount: result.successCount || 0,
      channel: useWhatsApp ? "whatsapp" : "sms",
    });

    res.status(200).json({
      success: true,
      message: "Custom alert sent successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  sendManualAlert,
  sendAutoDropoutAlerts,
  sendCustomAlert,
  getAlertHistory,
};