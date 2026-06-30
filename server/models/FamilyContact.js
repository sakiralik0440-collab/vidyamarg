const mongoose = require("mongoose");

const familyContactSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    relation: {
      type: String,
      enum: ["Father", "Mother", "Brother", "Sister", "Uncle", "Teacher", "Neighbour", "Other"],
      required: true,
    },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FamilyContact", familyContactSchema);