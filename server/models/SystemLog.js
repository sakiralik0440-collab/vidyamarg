const mongoose = require("mongoose");

const systemLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userName: {
      type: String,
    },
    userRole: {
      type: String,
      enum: ["student", "parent", "college", "company", "admin", "system"],
      default: "system",
    },
    action: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["AUTH", "SECURITY", "ACADEMIC", "PLACEMENT", "SYSTEM", "VERIFICATION"],
      default: "SYSTEM",
    },
    ipAddress: {
      type: String,
      default: "127.0.0.1",
    },
    details: {
      type: String,
    },
    status: {
      type: String,
      enum: ["SUCCESS", "WARNING", "FAILED"],
      default: "SUCCESS",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SystemLog", systemLogSchema);
