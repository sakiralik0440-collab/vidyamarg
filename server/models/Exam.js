const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "Board Exam",
        "Entrance Exam",
        "Admission Deadline",
        "Scholarship Deadline",
        "Government Exam",
        "Other",
      ],
      required: true,
    },
    applicableClasses: [{ type: String }],
    applicableStreams: [{ type: String }],
    examDate: { type: Date, required: true },
    registrationDeadline: { type: Date },
    description: { type: String },
    applicationLink: { type: String },
    isActive: { type: Boolean, default: true },
    reminderDays: [{ type: Number, default: [30, 15, 7, 1] }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);