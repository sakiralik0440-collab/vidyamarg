import { useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LanguageSelect from "./components/LanguageSelect";
import StudentRegistrationForm from "./components/StudentRegistrationForm";
import StudentProfile from "./components/StudentProfile";
import StudentLogin from "./components/StudentLogin";
import TeacherLogin from "./components/TeacherLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import OfflineBanner from "./components/OfflineBanner";
import InstallPrompt from "./components/InstallPrompt";
import FeatureView from "./components/FeatureView";
import PortalSelect from "./components/PortalSelect";
import "./App.css";

// Lazy load the 4 Unified Role Portals
const StudentPortal = lazy(() => import("./portals/student/StudentPortal"));
const ParentPortal = lazy(() => import("./portals/parent/ParentPortal"));
const CollegePortal = lazy(() => import("./portals/college/CollegePortal"));
const CompanyPortal = lazy(() => import("./portals/company/CompanyPortal"));

// =====================================================
// PARENT
// =====================================================

const ParentLogin = lazy(() =>
  import("./components/ParentLogin")
);

const ParentPortalLanding = lazy(() =>
  import("./components/ParentPortalLanding")
);

const ParentDashboard = lazy(() =>
  import("./components/ParentDashboard")
);

// =====================================================
// COLLEGE
// =====================================================

import CollegePortalLanding from "./components/CollegePortalLanding";
import CollegeLogin from "./components/CollegeLogin";
import CollegeDashboard from "./components/CollegeDashboard";

const AtRiskStudents = lazy(() =>
  import("./components/AtRiskStudents")
);

const HelplinePanel = lazy(() =>
  import("./components/HelplinePanel")
);

const DistrictView = lazy(() =>
  import("./components/DistrictView")
);

const CollegeGuidance = lazy(() =>
  import("./components/CollegeGuidance")
);

// =====================================================
// COMPANY
// =====================================================

import CompanyPortalLanding from "./components/CompanyPortalLanding";

const CompanyLogin = lazy(() =>
  import("./components/CompanyLogin")
);

const CompanyDashboard = lazy(() =>
  import("./components/CompanyDashboard")
);

const InterviewRequest = lazy(() =>
  import("./components/InterviewRequest")
);

// =====================================================
// ADMIN
// =====================================================

const AdminLogin = lazy(() =>
  import("./components/AdminLogin")
);

const AdminDashboard = lazy(() =>
  import("./components/AdminDashboard")
);

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center">

        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />

        <p className="text-slate-500 text-sm">
          Loading VidyaMarg...
        </p>

      </div>
    </div>
  );
}

function App() {
  const [languageChosen, setLanguageChosen] = useState(
    !!localStorage.getItem("appLanguage")
  );

  if (!languageChosen) {
    return <LanguageSelect onLanguageSelected={() => setLanguageChosen(true)} />;
  }

  return (
    <Router>
      <OfflineBanner />
      <InstallPrompt />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Master Landing & Unified Portal Selector */}
          <Route path="/" element={<PortalSelect />} />

          {/* 1. STUDENT PORTAL (Blue) */}
          <Route path="/student" element={<StudentPortal />} />
          <Route path="/student/dashboard" element={<StudentPortal />} />
          <Route path="/student/*" element={<StudentPortal />} />

          {/* 2. PARENT PORTAL (Purple) */}
          <Route path="/parent" element={<ParentPortal />} />
          <Route path="/parent/dashboard" element={<ParentPortal />} />
          <Route path="/parent/:id" element={<ParentDashboard />} />
          <Route path="/parent/*" element={<ParentPortal />} />

          {/* 3. COLLEGE PORTAL (Green) */}
          <Route path="/college" element={<CollegePortal />} />
          <Route path="/college/dashboard" element={<CollegePortal />} />
          <Route path="/college/*" element={<CollegePortal />} />

          {/* 4. COMPANY PORTAL (Orange) */}
          <Route path="/company" element={<CompanyPortal />} />
          <Route path="/company/dashboard" element={<CompanyPortal />} />
          <Route path="/company/login" element={<CompanyLogin />} />
          <Route path="/company/interview" element={<InterviewRequest />} />
          <Route path="/company/*" element={<CompanyPortal />} />


          {/* Supporting & Legacy Routes */}
          <Route path="/register" element={<StudentRegistrationForm />} />
          <Route path="/profile/:id" element={<StudentProfile />} />
          <Route path="/profile/:id/:featureId" element={<FeatureView />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/achievements" element={<AchievementWallPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route path="/teacher/register" element={<TeacherLogin defaultMode="register" />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>}
          />
          <Route
            path="/at-risk"
            element={<ProtectedRoute><AtRiskStudents /></ProtectedRoute>}
          />
          <Route
            path="/helpline"
            element={<ProtectedRoute><HelplinePanel /></ProtectedRoute>}
          />
          <Route
            path="/district"
            element={<ProtectedRoute><DistrictView /></ProtectedRoute>}
          />
          <Route
            path="/colleges"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-slate-900 p-8">
                  <h1 className="text-2xl font-bold text-white mb-6">College Management</h1>
                  <CollegeGuidance />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/interview"
            element={
              <ProtectedRoute>
                <InterviewRequest />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ADMIN
          ================================================= */}

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          {/* =================================================
              FALLBACK
          ================================================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;