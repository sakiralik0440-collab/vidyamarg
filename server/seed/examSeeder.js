require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const Exam = require("../models/Exam");

const exams = [
  {
    name: "MP Board Class 10th Exam 2025",
    type: "Board Exam",
    applicableClasses: ["10th"],
    applicableStreams: ["Science", "Commerce", "Arts", "Not Applicable"],
    examDate: new Date("2025-03-01"),
    registrationDeadline: new Date("2024-12-31"),
    description: "Madhya Pradesh Board of Secondary Education Class 10th annual examination",
    applicationLink: "https://mpbse.nic.in",
    reminderDays: [60, 30, 15, 7, 1],
    isActive: true,
  },
  {
    name: "MP Board Class 12th Exam 2025",
    type: "Board Exam",
    applicableClasses: ["12th"],
    applicableStreams: ["Science", "Commerce", "Arts"],
    examDate: new Date("2025-03-01"),
    registrationDeadline: new Date("2024-12-31"),
    description: "Madhya Pradesh Board of Secondary Education Class 12th annual examination",
    applicationLink: "https://mpbse.nic.in",
    reminderDays: [60, 30, 15, 7, 1],
    isActive: true,
  },
  {
    name: "JEE Main 2025 — Session 1",
    type: "Entrance Exam",
    applicableClasses: ["12th"],
    applicableStreams: ["Science"],
    examDate: new Date("2025-01-22"),
    registrationDeadline: new Date("2024-11-30"),
    description: "Joint Entrance Examination for engineering admission in NITs, IIITs and GFTIs",
    applicationLink: "https://jeemain.nta.ac.in",
    reminderDays: [90, 60, 30, 15, 7],
    isActive: true,
  },
  {
    name: "NEET UG 2025",
    type: "Entrance Exam",
    applicableClasses: ["12th"],
    applicableStreams: ["Science"],
    examDate: new Date("2025-05-04"),
    registrationDeadline: new Date("2025-03-07"),
    description: "National Eligibility cum Entrance Test for medical admissions",
    applicationLink: "https://neet.nta.nic.in",
    reminderDays: [90, 60, 30, 15, 7, 1],
    isActive: true,
  },
  {
    name: "CUET UG 2025",
    type: "Entrance Exam",
    applicableClasses: ["12th"],
    applicableStreams: ["Science", "Commerce", "Arts"],
    examDate: new Date("2025-05-15"),
    registrationDeadline: new Date("2025-03-22"),
    description: "Common University Entrance Test for central university admissions",
    applicationLink: "https://cuet.nta.nic.in",
    reminderDays: [60, 30, 15, 7],
    isActive: true,
  },
  {
    name: "MP ITI Admission 2025",
    type: "Admission Deadline",
    applicableClasses: ["10th", "12th"],
    applicableStreams: ["Science", "Commerce", "Arts", "Not Applicable"],
    examDate: new Date("2025-07-31"),
    registrationDeadline: new Date("2025-07-15"),
    description: "Admission deadline for ITI courses in Madhya Pradesh",
    applicationLink: "https://iti.mponline.gov.in",
    reminderDays: [30, 15, 7, 1],
    isActive: true,
  },
  {
    name: "NSP Scholarship Application 2024-25",
    type: "Scholarship Deadline",
    applicableClasses: ["11th", "12th", "B.A. 1st Year"],
    applicableStreams: ["Science", "Commerce", "Arts"],
    examDate: new Date("2024-10-31"),
    description: "National Scholarship Portal post-matric scholarship application deadline",
    applicationLink: "https://scholarships.gov.in",
    reminderDays: [30, 15, 7, 3, 1],
    isActive: true,
  },
  {
    name: "MP Police Constable Exam 2025",
    type: "Government Exam",
    applicableClasses: ["12th", "B.A. 1st Year", "B.A. 2nd Year", "B.A. 3rd Year"],
    applicableStreams: ["Science", "Commerce", "Arts", "Not Applicable"],
    examDate: new Date("2025-02-15"),
    registrationDeadline: new Date("2024-12-15"),
    description: "Madhya Pradesh Police recruitment examination for constable posts",
    applicationLink: "https://peb.mp.gov.in",
    reminderDays: [60, 30, 15, 7],
    isActive: true,
  },
];

const seedExams = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
    await Exam.deleteMany({});
    console.log("🗑️ Existing exams cleared");
    const inserted = await Exam.insertMany(exams);
    console.log(`✅ ${inserted.length} exams seeded successfully`);
    mongoose.connection.close();
    console.log("🔌 Connection closed");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedExams();