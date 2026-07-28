require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const GovtScheme = require("../models/GovtScheme");

const schemes = [
  {
    name: "PM Yasasvi Scholarship 2024",
    ministry: "Ministry of Social Justice & Empowerment",
    type: "Scholarship",
    description: "Scholarship for OBC, EBC and DNT students studying in class 9-12 and college. Amount up to ₹1,25,000 per year.",
    eligibility: {
      categories: ["OBC", "EWS"],
      minAge: 14,
      maxAge: 35,
      gender: "Any",
      incomeLimit: 250000,
    },
    benefit: "₹75,000 to ₹1,25,000 per year",
    applicationLink: "https://scholarships.gov.in",
    deadline: new Date("2024-11-30"),
    isNew: true,
    isActive: true,
  },
  {
    name: "PM SHRI Schools Initiative",
    ministry: "Ministry of Education",
    type: "Education Loan",
    description: "Upgraded model schools across India providing quality education with modern infrastructure and focus on NEP 2020.",
    eligibility: {
      categories: ["General", "OBC", "SC", "ST", "EWS"],
      gender: "Any",
    },
    benefit: "Quality education with modern facilities",
    applicationLink: "https://education.gov.in",
    isNew: true,
    isActive: true,
  },
  {
    name: "Skill India Digital 2024",
    ministry: "Ministry of Skill Development",
    type: "Skill Development",
    description: "Free digital and technology skill courses for youth. Learn AI, coding, digital marketing, and more online for free.",
    eligibility: {
      categories: ["General", "OBC", "SC", "ST", "EWS"],
      minAge: 15,
      maxAge: 35,
      gender: "Any",
    },
    benefit: "Free online skill courses + NSDC certificate",
    applicationLink: "https://skillindiadigital.gov.in",
    isNew: true,
    isActive: true,
  },
  {
    name: "National Apprenticeship Promotion Scheme",
    ministry: "Ministry of Skill Development",
    type: "Employment",
    description: "Get paid while learning. Stipend of ₹5,000-₹9,000/month during apprenticeship at companies across India.",
    eligibility: {
      categories: ["General", "OBC", "SC", "ST", "EWS"],
      minAge: 14,
      maxAge: 35,
      gender: "Any",
    },
    benefit: "₹5,000-₹9,000/month stipend + job certificate",
    applicationLink: "https://apprenticeshipindia.gov.in",
    isNew: false,
    isActive: true,
  },
  {
    name: "Pradhan Mantri Mudra Yojana",
    ministry: "Ministry of Finance",
    type: "Employment",
    description: "Business loan up to ₹10 lakhs for small business and self-employment. No collateral required.",
    eligibility: {
      categories: ["General", "OBC", "SC", "ST", "EWS"],
      minAge: 18,
      gender: "Any",
    },
    benefit: "Loan up to ₹10,00,000 without collateral",
    applicationLink: "https://mudra.org.in",
    isNew: false,
    isActive: true,
  },
];

const seedSchemes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
    await GovtScheme.deleteMany({});
    console.log("🗑️ Existing schemes cleared");
    const inserted = await GovtScheme.insertMany(schemes);
    console.log(`✅ ${inserted.length} schemes seeded`);
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedSchemes();