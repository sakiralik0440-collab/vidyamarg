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

// Lazy load heavy pages
const TeacherDashboard = lazy(() => import("./components/TeacherDashboard"));
const AtRiskStudents = lazy(() => import("./components/AtRiskStudents"));
const Leaderboard = lazy(() => import("./components/Leaderboard"));
const CollegeGuidance = lazy(() => import("./components/CollegeGuidance"));
const CompanyLogin = lazy(() => import("./components/CompanyLogin"));
const CompanyDashboard = lazy(() => import("./components/CompanyDashboard"));
const InterviewRequest = lazy(() => import("./components/InterviewRequest"));
const JobsPage = lazy(() => import("./components/JobsPage"));
const ParentDashboard = lazy(() => import("./components/ParentDashboard"));
const AchievementWallPage = lazy(() => import("./components/AchievementWallPage"));
const HelplinePanel = lazy(() => import("./components/HelplinePanel"));
const DistrictView = lazy(() => import("./components/DistrictView"));

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  const [languageChosen, setLanguageChosen] = useState(
    !!localStorage.getItem("appLanguage")
  );
  const existingStudentId = localStorage.getItem("studentId");

  if (!languageChosen) {
    return <LanguageSelect onLanguageSelected={() => setLanguageChosen(true)} />;
  }

  return (
    <Router>
      <OfflineBanner />
      <InstallPrompt />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<PortalSelect />} />
          <Route path="/register" element={<StudentRegistrationForm />} />
          <Route path="/profile/:id" element={<StudentProfile />} />
          <Route path="/profile/:id" element={<StudentProfile />} />
          <Route path="/profile/:id/:featureId" element={<FeatureView />} />
          <Route path="/parent/:id" element={<ParentDashboard />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/achievements" element={<AchievementWallPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route path="/teacher/register" element={<TeacherLogin defaultMode="register" />} />
          <Route path="/teacher/register" element={<Navigate to="/teacher/login" />} />
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route path="/teacher/register" element={<TeacherLogin />} />
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
                <div className="min-h-screen bg-green-50 p-8">
                  <h1 className="text-2xl font-bold text-green-800 mb-6">College Management</h1>
                  <CollegeGuidance />
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="/company/login" element={<CompanyLogin />} />
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/company/interview" element={<InterviewRequest />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;