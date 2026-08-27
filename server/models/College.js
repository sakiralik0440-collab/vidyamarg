const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: { type: String, required: true },
    code: { type: String, trim: true },
    district: { type: String, required: true },
    state: { type: String, default: "Madhya Pradesh" },
    address: { type: String },
    website: { type: String },
    accreditation: { type: String, default: "AICTE / UGC Approved" },
    isVerified: { type: Boolean, default: false },
    streamsOffered: [
      {
        type: String,
        enum: ["Science", "Commerce", "Arts", "Engineering", "Medical", "Law", "ITI/Skill", "Management"],
      },
    ],
    departments: [
      {
        name: String,
        hodName: String,
        courses: [String],
      },
    ],
    placementOfficer: {
      name: String,
      email: String,
      phone: String,
    },
    feesPerYear: { type: Number },
    minCutoffPercentage: { type: Number },
    categoryQuota: [{ type: String }],
    seatsAvailable: { type: Number },
    admissionDeadline: { type: Date },
    contactNumber: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("College", collegeSchema);