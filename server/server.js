require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const connectDB = require("./config/db");

const app = express();

// Middleware

const helmet = require("helmet");
app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://vidyamarg-git-main-sakiralik0440-collabs-projects.vercel.app",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  })
);

const compression = require("compression");
app.use(compression());

const rateLimit = require("express-rate-limit");

// General rate limit — 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, message: "Too many requests, please try again later" },
});

// Stricter limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, message: "Too many login attempts, please try again later" },
});

app.use("/api/", limiter);
app.use("/api/auth/", authLimiter);
app.use("/api/company/login", authLimiter);

app.use(express.json());

// Connect Database
connectDB();

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "🎓 VidyaMarg API running!",
    version: "1.0.0",
    status: "healthy",
  });
});

// Cache headers for static data
app.use("/api/colleges", (req, res, next) => {
  if (req.method === "GET") res.set("Cache-Control", "public, max-age=3600");
  next();
});
app.use("/api/scholarships", (req, res, next) => {
  if (req.method === "GET") res.set("Cache-Control", "public, max-age=3600");
  next();
});
app.use("/api/skills", (req, res, next) => {
  if (req.method === "GET") res.set("Cache-Control", "public, max-age=3600");
  next();
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/dropout", require("./routes/dropoutRoutes"));
app.use("/api/colleges", require("./routes/collegeRoutes"));
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));
app.use("/api/certificates", require("./routes/certificateRoutes"));
app.use("/api/alerts", require("./routes/alertRoutes"));
app.use("/api/company", require("./routes/companyRoutes"));
app.use("/api/interviews", require("./routes/interviewRoutes"));
app.use("/api/scholarships", require("./routes/scholarshipRoutes"));
app.use("/api/skills", require("./routes/skillRoutes"));
app.use("/api/mentors", require("./routes/mentorRoutes"));
app.use("/api/fees", require("./routes/feeRoutes"));
app.use("/api/achievements", require("./routes/achievementRoutes"));
app.use("/api/exams", require("./routes/examRoutes"));
app.use("/api/helpline", require("./routes/helplineRoutes"));
app.use("/api/district", require("./routes/districtRoutes"));
app.use("/api/schemes", require("./routes/govtSchemeRoutes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// Cron Jobs
const { runDropoutDetection } = require("./utils/dropoutDetection");
const { sendExamReminders } = require("./controllers/examController");
const { sendSchemeAlerts } = require("./controllers/govtSchemeController");

// Nightly dropout detection — midnight
cron.schedule("0 0 * * *", async () => {
  console.log("⏰ Running nightly dropout detection...");
  await runDropoutDetection();
});

// Daily exam reminders — 8 AM
cron.schedule("0 8 * * *", async () => {
  console.log("📚 Checking exam reminders...");
  try {
    const mockReq = {};
    const mockRes = {
      status: () => ({ json: (d) => console.log("Exam reminders:", d) }),
    };
    await sendExamReminders(mockReq, mockRes);
  } catch (err) {
    console.error("Exam reminder error:", err.message);
  }
});

// Daily scheme alerts — 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("🏛️ Checking new govt schemes...");
  try {
    const mockReq = {};
    const mockRes = {
      status: () => ({ json: (d) => console.log("Scheme alerts:", d) }),
    };
    await sendSchemeAlerts(mockReq, mockRes);
  } catch (err) {
    console.error("Scheme alert error:", err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 VidyaMarg Server running on port ${PORT}`);
});