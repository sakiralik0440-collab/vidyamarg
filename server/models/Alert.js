const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    alertType: {
      type: String,
      enum: [
        "dropoutRisk",
        "dropoutConfirmed",
        "admissionDeadline",
        "resultSuccess",
        "jobOpportunity",
        "custom",
      ],
      required: true,
    },
    message: { type: String, required: true },
    recipientCount: { type: Number, default: 0 },
    channel: {
      type: String,
      enum: ["sms", "whatsapp"],
      default: "sms",
    },
    isAutomatic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);