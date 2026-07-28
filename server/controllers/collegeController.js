const College = require("../models/College");

// @desc    Add a new college
// @route   POST /api/colleges
// @access  Private (Teacher/Admin)
const addCollege = async (req, res) => {
  try {
    const college = await College.create(req.body);
    res.status(201).json({
      success: true,
      message: "College added successfully",
      college,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all colleges
// @route   GET /api/colleges
// @access  Public
const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: colleges.length,
      colleges,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single college by ID
// @route   GET /api/colleges/:id
// @access  Public
const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }
    res.status(200).json({ success: true, college });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a college
// @route   PUT /api/colleges/:id
// @access  Private
const updateCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }
    res.status(200).json({ success: true, college });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a college
// @route   DELETE /api/colleges/:id
// @access  Private
const deleteCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);
    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }
    res.status(200).json({ success: true, message: "College deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Match colleges for a student based on marks, stream, category
// @route   POST /api/colleges/match
// @access  Public
const matchColleges = async (req, res) => {
  try {
    const { marksPercentage, stream, category, district, state } = req.body;

    if (!marksPercentage) {
      return res.status(400).json({
        success: false,
        message: "Marks percentage is required for matching",
      });
    }

    // Build match filter
    const filter = {};

    // Match stream if provided and not "Not Applicable"
    if (stream && stream !== "Not Applicable") {
      filter.streamsOffered = { $in: [stream] };
    }

    // Match colleges where student's marks meet the cutoff
    // $lte means student marks >= college cutoff (student qualifies)
    filter.$or = [
      { minCutoffPercentage: { $lte: Number(marksPercentage) } },
      { minCutoffPercentage: { $exists: false } },
      { minCutoffPercentage: null },
    ];

    // Prefer same district first, then same state
    if (district) filter.district = new RegExp(district, "i");
    else if (state) filter.state = new RegExp(state, "i");

    let colleges = await College.find(filter).sort({
      minCutoffPercentage: -1,
    });

    // If no colleges found in district, search by state
    if (colleges.length === 0 && district && state) {
      delete filter.district;
      filter.state = new RegExp(state, "i");
      colleges = await College.find(filter).sort({
        minCutoffPercentage: -1,
      });
    }

    // If still no colleges, return all matching marks
    if (colleges.length === 0) {
      delete filter.state;
      colleges = await College.find(filter).sort({
        minCutoffPercentage: -1,
      });
    }

    // Calculate match score for each college
    const matchedColleges = colleges.map((college) => {
      let matchScore = 0;

      // Marks well above cutoff = better match
      if (college.minCutoffPercentage) {
        const gap = marksPercentage - college.minCutoffPercentage;
        if (gap >= 20) matchScore += 30;
        else if (gap >= 10) matchScore += 20;
        else if (gap >= 0) matchScore += 10;
      }

      // Same district = higher priority
      if (
        district &&
        college.district.toLowerCase().includes(district.toLowerCase())
      ) {
        matchScore += 30;
      }

      // Stream match
      if (stream && college.streamsOffered.includes(stream)) {
        matchScore += 20;
      }

      // Category quota match
      if (category && college.categoryQuota.includes(category)) {
        matchScore += 20;
      }

      return {
        ...college.toObject(),
        matchScore,
      };
    });

    // Sort by match score (highest first)
    matchedColleges.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      count: matchedColleges.length,
      colleges: matchedColleges,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addCollege,
  getAllColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
  matchColleges,
};