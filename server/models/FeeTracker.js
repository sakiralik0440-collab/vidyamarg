const mongoose = require("mongoose");

const feeTrackerSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    entries: [
      {
        type: {
          type: String,
          enum: ["Fee Paid", "Scholarship Received", "Stipend", "Other Income", "Other Expense"],
          required: true,
        },
        amount: { type: Number, required: true },
        description: { type: String, required: true },
        date: { type: Date, default: Date.now },
        academicYear: { type: String },
        institution: { type: String },
        receiptNumber: { type: String },
        isVerified: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

// Virtual for total fees paid
feeTrackerSchema.virtual("totalFeesPaid").get(function () {
  return this.entries
    .filter((e) => e.type === "Fee Paid" || e.type === "Other Expense")
    .reduce((sum, e) => sum + e.amount, 0);
});

// Virtual for total received
feeTrackerSchema.virtual("totalReceived").get(function () {
  return this.entries
    .filter(
      (e) =>
        e.type === "Scholarship Received" ||
        e.type === "Stipend" ||
        e.type === "Other Income"
    )
    .reduce((sum, e) => sum + e.amount, 0);
});

feeTrackerSchema.set("toJSON", { virtuals: true });
feeTrackerSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("FeeTracker", feeTrackerSchema);