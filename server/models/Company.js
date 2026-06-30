const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    industryType: { type: String },
    minActivityScore: { type: Number, default: 0 },
    jobsPosted: [
      {
        title: String,
        description: String,
        salary: String,
        postedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);