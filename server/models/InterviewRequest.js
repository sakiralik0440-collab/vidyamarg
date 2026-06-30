const mongoose = require("mongoose");

const interviewRequestSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    jobTitle: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Interviewed", "Hired"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewRequest", interviewRequestSchema);
    