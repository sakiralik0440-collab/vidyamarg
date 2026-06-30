const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    dateOfBirth: { type: Date },
    village: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, default: "Madhya Pradesh" },
    category: {
      type: String,
      enum: ["General", "OBC", "SC", "ST", "EWS"],
      required: true,
    },
    currentClass: { type: String, required: true }, // e.g. "10th", "12th", "B.A. 1st Year"
    stream: {
      type: String,
      enum: ["Science", "Commerce", "Arts", "Not Applicable"],
      default: "Not Applicable",
    },
    interestedField: { type: String }, // e.g. "Engineering", "Medical", "Govt Job"
    status: {
      type: String,
      enum: ["Active", "At Risk", "Dropout", "Placed", "Graduated"],
      default: "Active",
    },
    activityScore: { type: Number, default: 0, min: 0, max: 100 },
    lastUpdated: { type: Date, default: Date.now },
    familyContacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FamilyContact",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);