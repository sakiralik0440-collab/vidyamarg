const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, default: "Madhya Pradesh" },
    streamsOffered: [
      {
        type: String,
        enum: ["Science", "Commerce", "Arts", "Engineering", "Medical", "Law", "ITI/Skill"],
      },
    ],
    feesPerYear: { type: Number },
    minCutoffPercentage: { type: Number },
    categoryQuota: [{ type: String }], // e.g. ["General", "OBC", "SC"]
    seatsAvailable: { type: Number },
    admissionDeadline: { type: Date },
    contactNumber: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("College", collegeSchema);