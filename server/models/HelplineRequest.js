const mongoose = require("mongoose");

const helplineRequestSchema = new mongoose.Schema(
  {
    anonymousId: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: [
        "Bullying",
        "Financial Problem",
        "Family Pressure",
        "Mental Health",
        "Academic Stress",
        "Dropout Risk",
        "Other",
      ],
      required: true,
    },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    response: { type: String },
    isUrgent: { type: Boolean, default: false },
    village: { type: String },
    district: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HelplineRequest", helplineRequestSchema);