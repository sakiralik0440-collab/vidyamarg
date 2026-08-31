require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const cron = require("node-cron");

const connectDB = require("./config/db");

const app = express();

/* =========================================================
   MIDDLEWARE
========================================================= */

// Security headers
app.use(helmet());

// ---------------------------------------------------------
// CORS CONFIGURATION
// ---------------------------------------------------------

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",

  // Production Vercel domain
  "https://vidyamarg.vercel.app",

  // Existing Vercel deployment domain
  "https://vidyamarg-git-main-sakiralik0440-collabs-projects.vercel.app",

  // Render environment variable
  process.env.FRONTEND_URL,
].filter(Boolean);

console.log("Allowed CORS origins:", allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without an Origin header.
    // Useful for Postman, server-to-server requests, etc.
    if (!origin) {
      return callback(null, true);
    }

    // Exact allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow VidyaMarg Vercel preview/deployment URLs
    if (
      origin.startsWith("https://vidyamarg-") &&
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    console.log("❌ CORS blocked origin:", origin);

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
};

app.use(cors(corsOptions));

// Handle browser preflight requests
app.options("*", cors(corsOptions));

// Compression
app.use(compression());

// JSON body parser
app.use(express.json());

/* =========================================================
   RATE LIMITING
========================================================= */

// General API rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});


// Authentication rate limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    success: false,
    message: "Too many login attempts, please try again later",
  },
});

app.use("/api/", limiter);

app.use("/api/auth/", authLimiter);

app.use("/api/company/login", authLimiter);

/* =========================================================
   DATABASE
========================================================= */

connectDB();

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/", (req, res) => {
  res.status(200).json({
    message: "🎓 VidyaMarg API running!",
    version: "1.0.0",
    status: "healthy",
  });
});

/* =========================================================
   API REQUEST LOGGER
   Useful for Render debugging
========================================================= */

app.use("/api", (req, res, next) => {
  console.log(
    `📡 ${req.method} ${req.originalUrl} | Origin: ${
      req.headers.origin || "No Origin"
    }`
  );

  next();
});

/* =========================================================
   CACHE HEADERS
========================================================= */

app.use("/api/colleges", (req, res, next) => {
  if (req.method === "GET") {
    res.set("Cache-Control", "public, max-age=3600");
  }

  next();
});

app.use("/api/scholarships", (req, res, next) => {
  if (req.method === "GET") {
    res.set("Cache-Control", "public, max-age=3600");
  }

  next();
});

app.use("/api/skills", (req, res, next) => {
  if (req.method === "GET") {
    res.set("Cache-Control", "public, max-age=3600");
  }

  next();
});

/* =========================================================
   API ROUTES
========================================================= */

// Unified Role Portals
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/student",
  require("./routes/studentPortalRoutes")
);

app.use(
  "/api/parent",
  require("./routes/parentPortalRoutes")
);

app.use(
  "/api/college",
  require("./routes/collegePortalRoutes")
);

app.use(
  "/api/company-portal",
  require("./routes/companyPortalRoutes")
);

app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);


// Legacy & Supporting Resource Routes
app.use(
  "/api/students",
  require("./routes/studentRoutes")
);

app.use(
  "/api/progress",
  require("./routes/progressRoutes")
);

app.use(
  "/api/dropout",
  require("./routes/dropoutRoutes")
);

app.use(
  "/api/colleges",
  require("./routes/collegeRoutes")
);

app.use(
  "/api/leaderboard",
  require("./routes/leaderboardRoutes")
);

app.use(
  "/api/certificates",
  require("./routes/certificateRoutes")
);

app.use(
  "/api/alerts",
  require("./routes/alertRoutes")
);

app.use(
  "/api/company",
  require("./routes/companyRoutes")
);

app.use(
  "/api/interviews",
  require("./routes/interviewRoutes")
);

app.use(
  "/api/scholarships",
  require("./routes/scholarshipRoutes")
);

app.use(
  "/api/skills",
  require("./routes/skillRoutes")
);

app.use(
  "/api/mentors",
  require("./routes/mentorRoutes")
);

app.use(
  "/api/fees",
  require("./routes/feeRoutes")
);

app.use(
  "/api/achievements",
  require("./routes/achievementRoutes")
);

app.use(
  "/api/exams",
  require("./routes/examRoutes")
);

app.use(
  "/api/helpline",
  require("./routes/helplineRoutes")
);

app.use(
  "/api/district",
  require("./routes/districtRoutes")
);

app.use(
  "/api/schemes",
  require("./routes/govtSchemeRoutes")
);

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  // CORS error
  if (err.message && err.message.startsWith("CORS blocked")) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

/* =========================================================
   CRON JOBS
========================================================= */

const {
  runDropoutDetection,
} = require("./utils/dropoutDetection");

const {
  sendExamReminders,
} = require("./controllers/examController");

const {
  sendSchemeAlerts,
} = require("./controllers/govtSchemeController");


// Nightly dropout detection — midnight
cron.schedule("0 0 * * *", async () => {
  console.log("⏰ Running nightly dropout detection...");

  try {
    await runDropoutDetection();
  } catch (error) {
    console.error(
      "❌ Dropout detection error:",
      error.message
    );
  }
});


// Daily exam reminders — 8 AM
cron.schedule("0 8 * * *", async () => {
  console.log("📚 Checking exam reminders...");

  try {
    const mockReq = {};

    const mockRes = {
      status: () => ({
        json: (data) => {
          console.log("Exam reminders:", data);
        },
      }),
    };

    await sendExamReminders(
      mockReq,
      mockRes
    );
  } catch (error) {
    console.error(
      "❌ Exam reminder error:",
      error.message
    );
  }
});


// Daily government scheme alerts — 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("🏛️ Checking new govt schemes...");

  try {
    const mockReq = {};

    const mockRes = {
      status: () => ({
        json: (data) => {
          console.log("Scheme alerts:", data);
        },
      }),
    };

    await sendSchemeAlerts(
      mockReq,
      mockRes
    );
  } catch (error) {
    console.error(
      "❌ Scheme alert error:",
      error.message
    );
  }
});

/* =========================================================
   SERVER
========================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 VidyaMarg Server running on port ${PORT}`
  );

  console.log(
    `🌐 Environment: ${
      process.env.NODE_ENV || "development"
    }`
  );

  console.log(
    `🔗 Frontend URL: ${
      process.env.FRONTEND_URL || "Not configured"
    }`
  );
});