const FeeTracker = require("../models/FeeTracker");

// @desc    Get fee tracker for a student
// @route   GET /api/fees/:studentId
// @access  Public
const getFeeTracker = async (req, res) => {
  try {
    let tracker = await FeeTracker.findOne({
      student: req.params.studentId,
    });

    // Create empty tracker if doesn't exist
    if (!tracker) {
      tracker = await FeeTracker.create({
        student: req.params.studentId,
        entries: [],
      });
    }

    // Calculate summary
    const summary = {
      totalFeesPaid: tracker.entries
        .filter((e) => e.type === "Fee Paid" || e.type === "Other Expense")
        .reduce((sum, e) => sum + e.amount, 0),
      totalReceived: tracker.entries
        .filter(
          (e) =>
            e.type === "Scholarship Received" ||
            e.type === "Stipend" ||
            e.type === "Other Income"
        )
        .reduce((sum, e) => sum + e.amount, 0),
      totalEntries: tracker.entries.length,
    };

    summary.netBalance = summary.totalReceived - summary.totalFeesPaid;

    res.status(200).json({
      success: true,
      tracker,
      summary,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add an entry to fee tracker
// @route   POST /api/fees/:studentId
// @access  Public
const addEntry = async (req, res) => {
  try {
    const { type, amount, description, date, academicYear, institution, receiptNumber } =
      req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    let tracker = await FeeTracker.findOne({
      student: req.params.studentId,
    });

    if (!tracker) {
      tracker = new FeeTracker({
        student: req.params.studentId,
        entries: [],
      });
    }

    tracker.entries.push({
      type,
      amount: Number(amount),
      description,
      date: date || new Date(),
      academicYear,
      institution,
      receiptNumber,
    });

    await tracker.save();

    // Recalculate summary
    const summary = {
      totalFeesPaid: tracker.entries
        .filter((e) => e.type === "Fee Paid" || e.type === "Other Expense")
        .reduce((sum, e) => sum + e.amount, 0),
      totalReceived: tracker.entries
        .filter(
          (e) =>
            e.type === "Scholarship Received" ||
            e.type === "Stipend" ||
            e.type === "Other Income"
        )
        .reduce((sum, e) => sum + e.amount, 0),
    };

    res.status(201).json({
      success: true,
      message: "Entry added successfully",
      entry: tracker.entries[tracker.entries.length - 1],
      summary,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an entry
// @route   DELETE /api/fees/:studentId/:entryId
// @access  Public
const deleteEntry = async (req, res) => {
  try {
    const tracker = await FeeTracker.findOne({
      student: req.params.studentId,
    });

    if (!tracker) {
      return res.status(404).json({
        success: false,
        message: "Tracker not found",
      });
    }

    tracker.entries = tracker.entries.filter(
      (e) => e._id.toString() !== req.params.entryId
    );

    await tracker.save();

    res.status(200).json({
      success: true,
      message: "Entry deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFeeTracker, addEntry, deleteEntry };