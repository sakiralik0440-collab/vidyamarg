const HelplineRequest = require("../models/HelplineRequest");
const crypto = require("crypto");

// @desc    Submit anonymous helpline request
// @route   POST /api/helpline
// @access  Public (anonymous)
const submitRequest = async (req, res) => {
  try {
    const { category, message, isUrgent, village, district } = req.body;

    if (!message || message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Please describe your problem in at least 10 characters",
      });
    }

    // Generate completely anonymous ID
    const anonymousId =
      "ANON-" + crypto.randomBytes(8).toString("hex").toUpperCase();

    const request = await HelplineRequest.create({
      anonymousId,
      category,
      message: message.trim(),
      isUrgent: isUrgent || false,
      village: village || "",
      district: district || "",
    });

    res.status(201).json({
      success: true,
      message:
        "Your request has been submitted anonymously. Help is on the way.",
      anonymousId,
      note: "Save this ID to track your request: " + anonymousId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Track request by anonymous ID
// @route   GET /api/helpline/:anonymousId
// @access  Public
const trackRequest = async (req, res) => {
  try {
    const request = await HelplineRequest.findOne({
      anonymousId: req.params.anonymousId,
    }).select("-__v");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "No request found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      request: {
        anonymousId: request.anonymousId,
        category: request.category,
        status: request.status,
        response: request.response,
        isUrgent: request.isUrgent,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all helpline requests (teacher/admin)
// @route   GET /api/helpline
// @access  Private (Teacher)
const getAllRequests = async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const requests = await HelplineRequest.find(filter)
      .select("-message")
      .sort({ isUrgent: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Respond to a helpline request
// @route   PUT /api/helpline/:id/respond
// @access  Private (Teacher)
const respondToRequest = async (req, res) => {
  try {
    const { response, status } = req.body;

    const request = await HelplineRequest.findByIdAndUpdate(
      req.params.id,
      { response, status: status || "In Progress" },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Response added",
      request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitRequest,
  trackRequest,
  getAllRequests,
  respondToRequest,
};