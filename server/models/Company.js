const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    location: { type: String, required: true },
    district: { type: String },
    state: { type: String, default: "Madhya Pradesh" },
    industryType: { type: String },
    phone: { type: String },
    website: { type: String },
    description: { type: String },
    isVerified: { type: Boolean, default: false },
    minActivityScore: { type: Number, default: 0 },
    jobsPosted: [
      {
        title: String,
        description: String,
        salary: String,
        minMarks: Number,
        minActivityScore: Number,
        stream: String,
        postedAt: { type: Date, default: Date.now },
        isActive: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
companySchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
companySchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Company", companySchema);