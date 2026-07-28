const Student = require("../models/Student");
const Progress = require("../models/Progress");

// @desc    Get village leaderboard
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const { village, district, state } = req.query;

    // Build location filter
    const locationFilter = {};
    if (village) locationFilter.village = new RegExp(village, "i");
    else if (district) locationFilter.district = new RegExp(district, "i");
    else if (state) locationFilter.state = new RegExp(state, "i");

    // Get all students with progress records
    const students = await Student.find(locationFilter);

    // Fetch progress for all students
    const studentIds = students.map((s) => s._id);
    const allProgress = await Progress.find({
      student: { $in: studentIds },
    });

    // Group progress by student
    const progressByStudent = {};
    allProgress.forEach((p) => {
      const id = p.student.toString();
      if (!progressByStudent[id]) progressByStudent[id] = [];
      progressByStudent[id].push(p);
    });

    // ── Category 1: Class Toppers ──────────────────────────────────────
    // Best marks per class level
    const classToppers = {};
    allProgress.forEach((p) => {
      if (!p.marksPercentage) return;
      const className = p.className;
      if (
        !classToppers[className] ||
        p.marksPercentage > classToppers[className].marks
      ) {
        const student = students.find(
          (s) => s._id.toString() === p.student.toString()
        );
        if (student) {
          classToppers[className] = {
            student: {
              _id: student._id,
              name: student.name,
              village: student.village,
              district: student.district,
            },
            marks: p.marksPercentage,
            academicYear: p.academicYear,
            className,
          };
        }
      }
    });

    // ── Category 2: Most Improved ──────────────────────────────────────
    // Student with biggest marks improvement between any two years
    const mostImproved = [];
    students.forEach((student) => {
      const records = (progressByStudent[student._id.toString()] || [])
        .filter((p) => p.marksPercentage)
        .sort((a, b) => a.academicYear.localeCompare(b.academicYear));

      if (records.length >= 2) {
        let maxImprovement = 0;
        for (let i = 1; i < records.length; i++) {
          const improvement = records[i].marksPercentage - records[i - 1].marksPercentage;
          if (improvement > maxImprovement) maxImprovement = improvement;
        }
        if (maxImprovement > 0) {
          mostImproved.push({
            student: {
              _id: student._id,
              name: student.name,
              village: student.village,
              district: student.district,
            },
            improvement: Math.round(maxImprovement * 10) / 10,
          });
        }
      }
    });

    mostImproved.sort((a, b) => b.improvement - a.improvement);

    // ── Category 3: Longest Study Streak ──────────────────────────────
    // Student with most consecutive years of study without dropout
    const studyStreaks = students
      .map((student) => {
        const records = progressByStudent[student._id.toString()] || [];
        return {
          student: {
            _id: student._id,
            name: student.name,
            village: student.village,
            district: student.district,
          },
          streak: records.length,
          status: student.status,
        };
      })
      .filter((s) => s.streak > 0)
      .sort((a, b) => b.streak - a.streak);

    // ── Category 4: Highest Activity Score ────────────────────────────
    const topActivityScore = [...students]
      .filter((s) => s.activityScore > 0)
      .sort((a, b) => b.activityScore - a.activityScore)
      .slice(0, 5)
      .map((s) => ({
        student: {
          _id: s._id,
          name: s.name,
          village: s.village,
          district: s.district,
        },
        activityScore: s.activityScore,
        status: s.status,
      }));

    // ── Category 5: First Graduate in Family ──────────────────────────
    const firstGraduates = students
      .filter((s) => s.status === "Graduated" || s.status === "Placed")
      .map((s) => ({
        student: {
          _id: s._id,
          name: s.name,
          village: s.village,
          district: s.district,
        },
        status: s.status,
        activityScore: s.activityScore,
      }));

    // ── Overall Village Stats ──────────────────────────────────────────
    const totalStudents = students.length;
    const activeStudents = students.filter((s) => s.status === "Active").length;
    const graduatedStudents = students.filter(
      (s) => s.status === "Graduated" || s.status === "Placed"
    ).length;
    const avgActivityScore =
      students.length > 0
        ? Math.round(
            students.reduce((sum, s) => sum + s.activityScore, 0) /
              students.length
          )
        : 0;

    res.status(200).json({
      success: true,
      leaderboard: {
        classToppers: Object.values(classToppers).sort((a, b) =>
          a.className.localeCompare(b.className)
        ),
        mostImproved: mostImproved.slice(0, 5),
        studyStreaks: studyStreaks.slice(0, 5),
        topActivityScore: topActivityScore.slice(0, 5),
        firstGraduates,
      },
      stats: {
        totalStudents,
        activeStudents,
        graduatedStudents,
        avgActivityScore,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get district level comparison
// @route   GET /api/leaderboard/district
// @access  Public
const getDistrictComparison = async (req, res) => {
  try {
    const { state = "Madhya Pradesh" } = req.query;

    // Get all students grouped by district
    const students = await Student.find({
      state: new RegExp(state, "i"),
    });

    // Group by district
    const districtMap = {};
    students.forEach((student) => {
      const district = student.district;
      if (!districtMap[district]) {
        districtMap[district] = {
          district,
          total: 0,
          active: 0,
          graduated: 0,
          totalScore: 0,
        };
      }
      districtMap[district].total++;
      if (student.status === "Active") districtMap[district].active++;
      if (student.status === "Graduated" || student.status === "Placed") {
        districtMap[district].graduated++;
      }
      districtMap[district].totalScore += student.activityScore;
    });

    // Calculate averages and sort
    const districts = Object.values(districtMap)
      .map((d) => ({
        ...d,
        avgActivityScore: d.total > 0 ? Math.round(d.totalScore / d.total) : 0,
        graduationRate:
          d.total > 0 ? Math.round((d.graduated / d.total) * 100) : 0,
      }))
      .sort((a, b) => b.avgActivityScore - a.avgActivityScore);

    res.status(200).json({
      success: true,
      districts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getLeaderboard, getDistrictComparison };