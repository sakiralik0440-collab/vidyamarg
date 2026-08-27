const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    resumeUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"],
      default: "Applied",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    reviewerNotes: {
      type: String,
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications for the same job by the same student
applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
