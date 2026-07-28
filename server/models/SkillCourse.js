const mongoose = require("mongoose");

const skillCourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    provider: { type: String, required: true },
    type: {
      type: String,
      enum: ["ITI", "PMKVY", "Diploma", "Certificate", "Apprenticeship", "Online"],
      required: true,
    },
    trade: { type: String, required: true },
    duration: { type: String, required: true },
    fees: { type: Number, default: 0 },
    feesDescription: { type: String },
    eligibility: {
      minEducation: { type: String },
      minAge: { type: Number, default: 14 },
      maxAge: { type: Number, default: 35 },
      gender: {
        type: String,
        enum: ["Any", "Male", "Female"],
        default: "Any",
      },
    },
    jobRoles: [{ type: String }],
    avgSalary: { type: String },
    district: { type: String },
    state: { type: String, default: "Madhya Pradesh" },
    address: { type: String },
    contactNumber: { type: String },
    applicationLink: { type: String },
    description: { type: String },
    isGovernmentFunded: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SkillCourse", skillCourseSchema);