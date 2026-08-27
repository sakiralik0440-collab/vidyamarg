const mongoose = require("mongoose");

const parentStudentSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Parent ID is required"],
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student ID is required"],
    },
    relationship: {
      type: String,
      enum: ["Father", "Mother", "Guardian", "Other"],
      default: "Guardian",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emergencyContact: {
      type: String,
    },
    verifiedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Prevent duplicate parent-child links
parentStudentSchema.index({ parentId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model("ParentStudent", parentStudentSchema);
