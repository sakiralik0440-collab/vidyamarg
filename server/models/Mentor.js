const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String },
    village: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, default: "Madhya Pradesh" },
    currentStatus: {
      type: String,
      enum: ["Working", "College Student", "Graduated", "Self-Employed"],
      required: true,
    },
    currentOrganization: { type: String },
    field: { type: String, required: true },
    stream: { type: String },
    highestEducation: { type: String },
    canMentorIn: [{ type: String }],
    languagesSpoken: [{ type: String }],
    availableDays: [{ type: String }],
    availableTime: { type: String },
    bio: { type: String },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    linkedStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mentor", mentorSchema);