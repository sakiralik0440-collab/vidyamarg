const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Sports",
        "Arts & Culture",
        "NCC/NSS",
        "Community Service",
        "Academic",
        "Technology",
        "Hackathon",
        "Entrepreneurship",
        "Research",
        "Other",
      ],
      required: true,
    },
    description: { type: String },
    proofUrl: { type: String },
    level: {
      type: String,
      enum: ["College", "School", "District", "State", "National", "International"],
      default: "College",
    },
    position: { type: String, default: "Winner / Participant" },
    date: { type: Date, default: Date.now },
    academicYear: { type: String, default: "2025-2026" },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    isVerified: { type: Boolean, default: false },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectionReason: { type: String },
    likes: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Pre-save hook to ensure studentId is set
achievementSchema.pre("save", function () {
  if (this.student && !this.studentId) {
    this.studentId = this.student;
  }
});

module.exports = mongoose.model("Achievement", achievementSchema);