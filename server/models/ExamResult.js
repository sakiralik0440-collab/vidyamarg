const mongoose = require("mongoose");

const examResultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
    },
    subject: {
      type: String,
      required: true,
    },
    marksObtained: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      default: 100,
    },
    percentage: {
      type: Number,
    },
    grade: {
      type: String,
      default: "A",
    },
    examType: {
      type: String,
      enum: ["Internal Assessment", "Mid-Term", "Semester Final", "Practical Lab", "Quiz"],
      default: "Semester Final",
    },
    semester: {
      type: Number,
      default: 1,
    },
    academicYear: {
      type: String,
      default: "2025-2026",
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

// Auto-compute percentage and grade before save
examResultSchema.pre("save", function () {
  if (this.totalMarks > 0) {
    this.percentage = Math.round((this.marksObtained / this.totalMarks) * 100);
    if (this.percentage >= 90) this.grade = "A+";
    else if (this.percentage >= 80) this.grade = "A";
    else if (this.percentage >= 70) this.grade = "B+";
    else if (this.percentage >= 60) this.grade = "B";
    else if (this.percentage >= 50) this.grade = "C";
    else if (this.percentage >= 35) this.grade = "D";
    else this.grade = "F (At-Risk)";
  }
});

module.exports = mongoose.model("ExamResult", examResultSchema);
