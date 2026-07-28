const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
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
        "Entrepreneurship",
        "Other",
      ],
      required: true,
    },
    description: { type: String },
    level: {
      type: String,
      enum: ["School", "District", "State", "National", "International"],
      default: "School",
    },
    position: { type: String },
    date: { type: Date, default: Date.now },
    academicYear: { type: String },
    isVerified: { type: Boolean, default: false },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    likes: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Achievement", achievementSchema);