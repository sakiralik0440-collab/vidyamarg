const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Campus Drive"],
      default: "Full-time",
    },
    requirements: [
      {
        type: String,
      },
    ],
    skillsRequired: [
      {
        type: String,
      },
    ],
    ctc: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    minCgpa: {
      type: Number,
      default: 0,
    },
    minActivityScore: {
      type: Number,
      default: 0,
    },
    eligibleBranches: [
      {
        type: String,
      },
    ],
    eligibleBatches: [
      {
        type: String,
      },
    ],
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Active", "Closed", "Draft"],
      default: "Active",
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
