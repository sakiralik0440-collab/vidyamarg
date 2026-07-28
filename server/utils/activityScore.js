const Progress = require("../models/Progress");
const Certificate = require("../models/Certificate");

/**
 * Calculate Activity Score for a student (0-100)
 *
 * Components:
 * 1. Year completion streak     → max 20 pts
 * 2. Pass rate                  → max 20 pts
 * 3. Average marks              → max 20 pts
 * 4. Attendance consistency     → max 15 pts
 * 5. Certificates earned        → max 15 pts
 * 6. No dropout history         → max 10 pts
 */

const calculateActivityScore = async (student) => {
  try {
    // Fetch all progress records for this student
    const records = await Progress.find({ student: student._id });

    // Fetch all certificates
    const certificates = await Certificate.find({ student: student._id });

    let score = 0;
    const breakdown = {};

    // ── Component 1: Year Completion Streak (max 20 pts) ──────────────
    // Each year logged = 5 pts, capped at 4 years (20 pts)
    const streakPoints = Math.min(records.length * 5, 20);
    score += streakPoints;
    breakdown.streak = {
      points: streakPoints,
      max: 20,
      detail: `${records.length} year(s) logged`,
    };

    // ── Component 2: Pass Rate (max 20 pts) ───────────────────────────
    let passPoints = 0;
    if (records.length > 0) {
      const passedYears = records.filter((r) => r.result === "Pass").length;
      const passRate = passedYears / records.length;
      passPoints = Math.round(passRate * 20);
    }
    score += passPoints;
    breakdown.passRate = {
      points: passPoints,
      max: 20,
      detail: `${records.filter((r) => r.result === "Pass").length}/${records.length} years passed`,
    };

    // ── Component 3: Average Marks (max 20 pts) ───────────────────────
    let marksPoints = 0;
    const recordsWithMarks = records.filter(
      (r) => r.marksPercentage !== undefined && r.marksPercentage !== null
    );

    if (recordsWithMarks.length > 0) {
      const avgMarks =
        recordsWithMarks.reduce((sum, r) => sum + r.marksPercentage, 0) /
        recordsWithMarks.length;

      if (avgMarks >= 85) marksPoints = 20;
      else if (avgMarks >= 75) marksPoints = 17;
      else if (avgMarks >= 65) marksPoints = 14;
      else if (avgMarks >= 55) marksPoints = 10;
      else if (avgMarks >= 45) marksPoints = 6;
      else if (avgMarks >= 35) marksPoints = 3;

      breakdown.marks = {
        points: marksPoints,
        max: 20,
        detail: `Average marks: ${Math.round(avgMarks)}%`,
        avgMarks: Math.round(avgMarks),
      };
    } else {
      breakdown.marks = {
        points: 0,
        max: 20,
        detail: "No marks recorded yet",
      };
    }
    score += marksPoints;

    // ── Component 4: Attendance Consistency (max 15 pts) ──────────────
    let attendancePoints = 0;
    const recordsWithAttendance = records.filter(
      (r) =>
        r.attendancePercentage !== undefined &&
        r.attendancePercentage !== null
    );

    if (recordsWithAttendance.length > 0) {
      const avgAttendance =
        recordsWithAttendance.reduce(
          (sum, r) => sum + r.attendancePercentage,
          0
        ) / recordsWithAttendance.length;

      if (avgAttendance >= 95) attendancePoints = 15;
      else if (avgAttendance >= 85) attendancePoints = 12;
      else if (avgAttendance >= 75) attendancePoints = 9;
      else if (avgAttendance >= 65) attendancePoints = 6;
      else if (avgAttendance >= 55) attendancePoints = 3;

      breakdown.attendance = {
        points: attendancePoints,
        max: 15,
        detail: `Average attendance: ${Math.round(avgAttendance)}%`,
        avgAttendance: Math.round(avgAttendance),
      };
    } else {
      breakdown.attendance = {
        points: 0,
        max: 15,
        detail: "No attendance recorded yet",
      };
    }
    score += attendancePoints;

    // ── Component 5: Certificates Earned (max 15 pts) ─────────────────
    let certPoints = 0;
    if (certificates.length >= 3) certPoints = 15;
    else if (certificates.length === 2) certPoints = 10;
    else if (certificates.length === 1) certPoints = 5;

    score += certPoints;
    breakdown.certificates = {
      points: certPoints,
      max: 15,
      detail: `${certificates.length} certificate(s) earned`,
    };

    // ── Component 6: No Dropout History (max 10 pts) ──────────────────
    let dropoutPoints = 0;
    if (student.status === "Active" || student.status === "Graduated" || student.status === "Placed") {
      dropoutPoints = 10;
    } else if (student.status === "At Risk") {
      dropoutPoints = 5;
    }

    score += dropoutPoints;
    breakdown.dropout = {
      points: dropoutPoints,
      max: 10,
      detail: `Status: ${student.status}`,
    };

    // ── Cap at 100 ────────────────────────────────────────────────────
    const finalScore = Math.min(Math.round(score), 100);

    return {
      score: finalScore,
      breakdown,
    };
  } catch (error) {
    console.error("Activity score calculation error:", error.message);
    return { score: 0, breakdown: {} };
  }
};

// Update activity score in database for a student
const updateStudentActivityScore = async (student) => {
  try {
    const { score } = await calculateActivityScore(student);
    student.activityScore = score;
    await student.save();
    return score;
  } catch (error) {
    console.error("Failed to update activity score:", error.message);
    return student.activityScore;
  }
};

// Recalculate activity scores for ALL students
const recalculateAllScores = async () => {
  const Student = require("../models/Student");
  try {
    console.log("🔄 Recalculating activity scores for all students...");
    const students = await Student.find({});
    let updated = 0;

    for (const student of students) {
      const oldScore = student.activityScore;
      const newScore = await updateStudentActivityScore(student);
      if (oldScore !== newScore) {
        updated++;
        console.log(`📊 ${student.name}: ${oldScore} → ${newScore}`);
      }
    }

    console.log(`✅ Scores recalculated — ${updated} students updated`);
    return { success: true, updated, total: students.length };
  } catch (error) {
    console.error("❌ Recalculation failed:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  calculateActivityScore,
  updateStudentActivityScore,
  recalculateAllScores,
};