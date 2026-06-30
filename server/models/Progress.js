const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    academicYear: { type: String, required: true }, // e.g. "2023-2024"
    className: { type: String, required: true }, // e.g. "10th"
    marksPercentage: { type: Number, min: 0, max: 100 },
    result: {
      type: String,
      enum: ["Pass", "Fail", "Appearing", "Pending"],
      default: "Pending",
    },
    attendancePercentage: { type: Number, min: 0, max: 100 },
    remarks: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);