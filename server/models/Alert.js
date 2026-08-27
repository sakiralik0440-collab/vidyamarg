const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    role: {
      type: String,
      enum: ["student", "parent", "college", "company", "admin", "all"],
      default: "student",
    },
    title: {
      type: String,
      default: "System Notification",
    },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["info", "warning", "success", "danger"],
      default: "info",
    },
    link: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // Legacy support fields
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    alertType: {
      type: String,
      default: "custom",
    },
    channel: {
      type: String,
      enum: ["in-app", "sms", "whatsapp", "email"],
      default: "in-app",
    },
    isAutomatic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);