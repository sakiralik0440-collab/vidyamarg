require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const College = require("../models/College");

const colleges = [
  {
    name: "Government College of Excellence, Bhopal",
    district: "Bhopal",
    state: "Madhya Pradesh",
    streamsOffered: ["Science", "Commerce", "Arts"],
    feesPerYear: 8000,
    minCutoffPercentage: 60,
    categoryQuota: ["General", "OBC", "SC", "ST", "EWS"],
    seatsAvailable: 300,
    admissionDeadline: new Date("2024-07-31"),
    contactNumber: "0755-2551000",
    address: "Shyamla Hills, Bhopal, MP 462002",
  },
  {
    name: "Holkar Science College, Indore",
    district: "Indore",
    state: "Madhya Pradesh",
    streamsOffered: ["Science"],
    feesPerYear: 12000,
    minCutoffPercentage: 65,
    categoryQuota: ["General", "OBC", "SC", "ST"],
    seatsAvailable: 200,
    admissionDeadline: new Date("2024-07-15"),
    contactNumber: "0731-2511111",
    address: "AB Road, Indore, MP 452001",
  },
  {
    name: "Government Arts and Commerce College, Hoshangabad",
    district: "Hoshangabad",
    state: "Madhya Pradesh",
    streamsOffered: ["Arts", "Commerce"],
    feesPerYear: 5000,
    minCutoffPercentage: 45,
    categoryQuota: ["General", "OBC", "SC", "ST", "EWS"],
    seatsAvailable: 250,
    admissionDeadline: new Date("2024-08-15"),
    contactNumber: "07574-255000",
    address: "Main Road, Hoshangabad, MP 461001",
  },
  {
    name: "Maharaja Ranjit Singh College, Indore",
    district: "Indore",
    state: "Madhya Pradesh",
    streamsOffered: ["Science", "Commerce"],
    feesPerYear: 15000,
    minCutoffPercentage: 55,
    categoryQuota: ["General", "OBC", "SC"],
    seatsAvailable: 180,
    admissionDeadline: new Date("2024-07-20"),
    contactNumber: "0731-2432000",
    address: "Indore, MP 452001",
  },
  {
    name: "Government ITI College, Bhopal",
    district: "Bhopal",
    state: "Madhya Pradesh",
    streamsOffered: ["ITI/Skill"],
    feesPerYear: 3000,
    minCutoffPercentage: 35,
    categoryQuota: ["General", "OBC", "SC", "ST", "EWS"],
    seatsAvailable: 400,
    admissionDeadline: new Date("2024-08-30"),
    contactNumber: "0755-2600000",
    address: "Govindpura, Bhopal, MP 462023",
  },
  {
    name: "Barkatullah University, Bhopal",
    district: "Bhopal",
    state: "Madhya Pradesh",
    streamsOffered: ["Science", "Arts", "Commerce"],
    feesPerYear: 20000,
    minCutoffPercentage: 50,
    categoryQuota: ["General", "OBC", "SC", "ST", "EWS"],
    seatsAvailable: 500,
    admissionDeadline: new Date("2024-07-25"),
    contactNumber: "0755-2491000",
    address: "Hoshangabad Road, Bhopal, MP 462026",
  },
  {
    name: "Devi Ahilya Vishwavidyalaya, Indore",
    district: "Indore",
    state: "Madhya Pradesh",
    streamsOffered: ["Science", "Commerce", "Arts", "Engineering"],
    feesPerYear: 25000,
    minCutoffPercentage: 60,
    categoryQuota: ["General", "OBC", "SC", "ST"],
    seatsAvailable: 600,
    admissionDeadline: new Date("2024-07-10"),
    contactNumber: "0731-2762000",
    address: "Takshashila Campus, Indore, MP 452001",
  },
  {
    name: "Government Polytechnic College, Jabalpur",
    district: "Jabalpur",
    state: "Madhya Pradesh",
    streamsOffered: ["Engineering", "ITI/Skill"],
    feesPerYear: 18000,
    minCutoffPercentage: 50,
    categoryQuota: ["General", "OBC", "SC", "ST", "EWS"],
    seatsAvailable: 300,
    admissionDeadline: new Date("2024-08-01"),
    contactNumber: "0761-2600000",
    address: "Jabalpur, MP 482001",
  },
  {
    name: "Government Girls College, Sehore",
    district: "Sehore",
    state: "Madhya Pradesh",
    streamsOffered: ["Arts", "Commerce"],
    feesPerYear: 4000,
    minCutoffPercentage: 40,
    categoryQuota: ["General", "OBC", "SC", "ST", "EWS"],
    seatsAvailable: 200,
    admissionDeadline: new Date("2024-08-20"),
    contactNumber: "07562-222000",
    address: "Sehore, MP 466001",
  },
  {
    name: "Vikram University, Ujjain",
    district: "Ujjain",
    state: "Madhya Pradesh",
    streamsOffered: ["Science", "Arts", "Commerce"],
    feesPerYear: 15000,
    minCutoffPercentage: 50,
    categoryQuota: ["General", "OBC", "SC", "ST"],
    seatsAvailable: 400,
    admissionDeadline: new Date("2024-07-30"),
    contactNumber: "0734-2510000",
    address: "Ujjain, MP 456010",
  },
];

const seedColleges = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Clear existing colleges
    await College.deleteMany({});
    console.log("🗑️ Existing colleges cleared");

    // Insert new colleges
    const inserted = await College.insertMany(colleges);
    console.log(`✅ ${inserted.length} colleges seeded successfully`);

    mongoose.connection.close();
    console.log("🔌 Connection closed");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedColleges();