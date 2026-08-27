const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
    },
    rollNo: {
      type: String,
      trim: true,
    },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    dateOfBirth: { type: Date },
    village: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, default: "Madhya Pradesh" },
    address: { type: String },
    category: {
      type: String,
      enum: ["General", "OBC", "SC", "ST", "EWS"],
      required: true,
    },
    currentClass: { type: String, required: true }, // e.g. "10th", "12th", "B.Tech 3rd Year"
    course: { type: String }, // e.g. "B.Tech", "B.Sc", "B.Com"
    branch: { type: String }, // e.g. "Computer Science"
    semester: { type: Number, default: 1 },
    cgpa: { type: Number, default: 7.5, min: 0, max: 10 },
    attendancePercentage: { type: Number, default: 85, min: 0, max: 100 },
    careerReadinessScore: { type: Number, default: 50, min: 0, max: 100 },
    skills: [{ type: String }],
    stream: {
      type: String,
      enum: ["Science", "Commerce", "Arts", "Engineering", "Management", "Not Applicable"],
      default: "Not Applicable",
    },
    interestedField: { type: String }, // e.g. "Engineering", "Medical", "Govt Job", "Software Developer"
    status: {
      type: String,
      enum: ["Active", "At Risk", "Dropout", "Placed", "Graduated"],
      default: "Active",
    },
    activityScore: { type: Number, default: 0, min: 0, max: 100 },
    lastUpdated: { type: Date, default: Date.now },
    familyContacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FamilyContact",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);