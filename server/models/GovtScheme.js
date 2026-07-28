const mongoose = require("mongoose");

const govtSchemeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ministry: { type: String, required: true },
    type: {
      type: String,
      enum: ["Scholarship", "Skill Development", "Employment", "Education Loan", "Other"],
      required: true,
    },
    description: { type: String, required: true },
    eligibility: {
      categories: [{ type: String }],
      minAge: { type: Number },
      maxAge: { type: Number },
      gender: { type: String, enum: ["Any", "Male", "Female"], default: "Any" },
      states: [{ type: String }],
      incomeLimit: { type: Number },
    },
    benefit: { type: String },
    applicationLink: { type: String },
    deadline: { type: Date },
    launchDate: { type: Date, default: Date.now },
    isNew: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    alertSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GovtScheme", govtSchemeSchema);