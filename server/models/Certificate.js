const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "ClassTopper",
        "MostImproved",
        "ConsistentLearner",
        "FirstGraduate",
        "ActivityChampion",
        "Participation",
      ],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    academicYear: { type: String },
    issuedBy: { type: String, default: "VidyaMarg" },
    certificateNumber: { type: String, unique: true },
  },
  { timestamps: true }
);

// Auto-generate certificate number before saving
certificateSchema.pre("save", function (next) {
  if (!this.certificateNumber) {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.certificateNumber = `VM-${year}-${random}`;
  }
  next();
});

module.exports = mongoose.model("Certificate", certificateSchema);