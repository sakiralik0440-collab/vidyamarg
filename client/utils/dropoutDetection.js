const Student = require("../models/Student");
const Progress = require("../models/Progress");

// Time thresholds in milliseconds
const SIX_MONTHS = 6 * 30 * 24 * 60 * 60 * 1000;
const TWELVE_MONTHS = 12 * 30 * 24 * 60 * 60 * 1000;
const THREE_MONTHS = 3 * 30 * 24 * 60 * 60 * 1000;

// Calculate new status for a single student
const calculateStudentStatus = (student, lastProgressDate) => {
  const now = Date.now();

  // If student is already Placed or Graduated, don't change status
  if (student.status === "Placed" || student.status === "Graduated") {
    return student.status;
  }

  // If no progress record exists yet
  if (!lastProgressDate) {
    const registeredAgo = now - new Date(student.createdAt).getTime();
    if (registeredAgo > THREE_MONTHS) {
      return "At Risk";
    }
    return "Active";
  }

  // Calculate how long since last progress update
  const timeSinceUpdate = now - new Date(lastProgressDate).getTime();

  if (timeSinceUpdate > TWELVE_MONTHS) return "Dropout";
  if (timeSinceUpdate > SIX_MONTHS) return "At Risk";
  return "Active";
};

// Run dropout detection for ALL students in the database
const runDropoutDetection = async () => {
  try {
    console.log("🔍 Running dropout detection...");

    // Fetch all students who are not already Placed or Graduated
    const students = await Student.find({
      status: { $nin: ["Placed", "Graduated"] },
    });

    let updatedCount = 0;
    let results = { active: 0, atRisk: 0, dropout: 0 };

    for (const student of students) {
      // Get the most recent progress record for this student
      const latestProgress = await Progress.findOne({
        student: student._id,
      }).sort({ createdAt: -1 });

      const lastProgressDate = latestProgress
        ? latestProgress.createdAt
        : null;

      const newStatus = calculateStudentStatus(student, lastProgressDate);

      // Only update if status actually changed
      if (newStatus !== student.status) {
        student.status = newStatus;
        await student.save();
        updatedCount++;
        console.log(`📋 ${student.name}: ${student.status} → ${newStatus}`);
      }

      // Count results
      if (newStatus === "Active") results.active++;
      else if (newStatus === "At Risk") results.atRisk++;
      else if (newStatus === "Dropout") results.dropout++;
    }

    console.log(`✅ Dropout detection complete:`);
    console.log(`   Active: ${results.active}`);
    console.log(`   At Risk: ${results.atRisk}`);
    console.log(`   Dropout: ${results.dropout}`);
    console.log(`   Updated: ${updatedCount} students`);

    return { success: true, results, updatedCount };
  } catch (error) {
    console.error("❌ Dropout detection error:", error.message);
    return { success: false, error: error.message };
  }
};

// Run detection for a single student (called after progress update)
const runDetectionForStudent = async (studentId) => {
  try {
    const student = await Student.findById(studentId);
    if (!student) return null;

    const latestProgress = await Progress.findOne({
      student: studentId,
    }).sort({ createdAt: -1 });

    const lastProgressDate = latestProgress ? latestProgress.createdAt : null;
    const newStatus = calculateStudentStatus(student, lastProgressDate);

    if (newStatus !== student.status) {
      student.status = newStatus;
      await student.save();
    }

    return { studentId, newStatus };
  } catch (error) {
    console.error("❌ Single student detection error:", error.message);
    return null;
  }
};

module.exports = {
  runDropoutDetection,
  runDetectionForStudent,
  calculateStudentStatus,
};