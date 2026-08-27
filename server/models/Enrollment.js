const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      default: 1,
    },
    semester: {
      type: Number,
      default: 1,
    },
    rollNo: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Enrolled", "Completed", "Dropped", "Suspended"],
      default: "Enrolled",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);
