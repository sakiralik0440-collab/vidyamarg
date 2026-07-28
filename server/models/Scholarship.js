const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    provider: { type: String, required: true },
    type: {
      type: String,
      enum: ["Central Government", "State Government", "Private", "NGO"],
      required: true,
    },
    amount: { type: Number },
    amountDescription: { type: String },
    eligibility: {
      categories: [{ type: String }],
      minMarks: { type: Number, default: 0 },
      maxFamilyIncome: { type: Number },
      streams: [{ type: String }],
      classes: [{ type: String }],
      gender: {
        type: String,
        enum: ["Any", "Female", "Male"],
        default: "Any",
      },
      states: [{ type: String }],
    },
    deadline: { type: Date },
    applicationLink: { type: String },
    description: { type: String },
    documentsRequired: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scholarship", scholarshipSchema);