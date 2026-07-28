const Student = require("../models/Student");
const Progress = require("../models/Progress");
const Certificate = require("../models/Certificate");
const InterviewRequest = require("../models/InterviewRequest");

// @desc    Get district-wide overview
// @route   GET /api/district/overview
// @access  Private (Teacher/Admin)
const getDistrictOverview = async (req, res) => {
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
          atRisk: 0,
          dropout: 0,
          placed: 0,
          graduated: 0,
          totalScore: 0,
          villages: new Set(),
        };
      }
      districtMap[district].total++;
      districtMap[district].totalScore += student.activityScore;
      districtMap[district].villages.add(student.village);

      switch (student.status) {
        case "Active": districtMap[district].active++; break;
        case "At Risk": districtMap[district].atRisk++; break;
        case "Dropout": districtMap[district].dropout++; break;
        case "Placed": districtMap[district].placed++; break;
        case "Graduated": districtMap[district].graduated++; break;
      }
    });

    // Convert to array with computed fields
    const districts = Object.values(districtMap).map((d) => ({
      ...d,
      villages: d.villages.size,
      avgActivityScore:
        d.total > 0 ? Math.round(d.totalScore / d.total) : 0,
      dropoutRate:
        d.total > 0 ? Math.round((d.dropout / d.total) * 100) : 0,
      atRiskRate:
        d.total > 0 ? Math.round((d.atRisk / d.total) * 100) : 0,
      successRate:
        d.total > 0
          ? Math.round(((d.placed + d.graduated) / d.total) * 100)
          : 0,
    }));

    // Sort by dropout rate (most problematic first)
    districts.sort((a, b) => b.dropoutRate - a.dropoutRate);

    // State-wide totals
    const stateTotals = {
      totalStudents: students.length,
      totalActive: students.filter((s) => s.status === "Active").length,
      totalAtRisk: students.filter((s) => s.status === "At Risk").length,
      totalDropout: students.filter((s) => s.status === "Dropout").length,
      totalPlaced: students.filter((s) => s.status === "Placed").length,
      totalDistricts: districts.length,
      avgActivityScore:
        students.length > 0
          ? Math.round(
              students.reduce((sum, s) => sum + s.activityScore, 0) /
                students.length
            )
          : 0,
    };

    res.status(200).json({
      success: true,
      stateTotals,
      districts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get village-level breakdown for a district
// @route   GET /api/district/:district/villages
// @access  Private
const getVillageBreakdown = async (req, res) => {
  try {
    const { district } = req.params;
    const { state = "Madhya Pradesh" } = req.query;

    const students = await Student.find({
      district: new RegExp(district, "i"),
      state: new RegExp(state, "i"),
    });

    // Group by village
    const villageMap = {};
    students.forEach((student) => {
      const village = student.village;
      if (!villageMap[village]) {
        villageMap[village] = {
          village,
          district: student.district,
          total: 0,
          active: 0,
          atRisk: 0,
          dropout: 0,
          placed: 0,
          totalScore: 0,
          streams: {},
        };
      }
      villageMap[village].total++;
      villageMap[village].totalScore += student.activityScore;

      switch (student.status) {
        case "Active": villageMap[village].active++; break;
        case "At Risk": villageMap[village].atRisk++; break;
        case "Dropout": villageMap[village].dropout++; break;
        case "Placed": villageMap[village].placed++; break;
      }

      // Track streams
      const stream = student.stream || "Not Applicable";
      villageMap[village].streams[stream] =
        (villageMap[village].streams[stream] || 0) + 1;
    });

    const villages = Object.values(villageMap).map((v) => ({
      ...v,
      avgActivityScore:
        v.total > 0 ? Math.round(v.totalScore / v.total) : 0,
      dropoutRate:
        v.total > 0 ? Math.round((v.dropout / v.total) * 100) : 0,
      atRiskRate:
        v.total > 0 ? Math.round((v.atRisk / v.total) * 100) : 0,
      needsAttention: v.atRisk + v.dropout > 0,
    }));

    villages.sort((a, b) => b.dropoutRate - a.dropoutRate);

    res.status(200).json({
      success: true,
      district,
      totalStudents: students.length,
      villages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get stream-wise analysis
// @route   GET /api/district/stream-analysis
// @access  Private
const getStreamAnalysis = async (req, res) => {
  try {
    const { district, state = "Madhya Pradesh" } = req.query;
    const filter = { state: new RegExp(state, "i") };
    if (district) filter.district = new RegExp(district, "i");

    const students = await Student.find(filter);

    const streamMap = {};
    students.forEach((student) => {
      const stream = student.stream || "Not Applicable";
      if (!streamMap[stream]) {
        streamMap[stream] = {
          stream,
          total: 0,
          active: 0,
          atRisk: 0,
          dropout: 0,
          placed: 0,
          totalScore: 0,
        };
      }
      streamMap[stream].total++;
      streamMap[stream].totalScore += student.activityScore;
      if (student.status === "Active") streamMap[stream].active++;
      if (student.status === "At Risk") streamMap[stream].atRisk++;
      if (student.status === "Dropout") streamMap[stream].dropout++;
      if (student.status === "Placed") streamMap[stream].placed++;
    });

    const streams = Object.values(streamMap).map((s) => ({
      ...s,
      avgScore:
        s.total > 0 ? Math.round(s.totalScore / s.total) : 0,
      dropoutRate:
        s.total > 0 ? Math.round((s.dropout / s.total) * 100) : 0,
    }));

    res.status(200).json({
      success: true,
      streams,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDistrictOverview,
  getVillageBreakdown,
  getStreamAnalysis,
};