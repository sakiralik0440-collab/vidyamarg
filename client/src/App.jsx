import { useState, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "./components/LandingPage";
import LanguageSelect from "./components/LanguageSelect";
import PortalSelect from "./components/PortalSelect";
import ProtectedRoute from "./components/ProtectedRoute";
import OfflineBanner from "./components/OfflineBanner";
import InstallPrompt from "./components/InstallPrompt";

import StudentRegistrationForm from "./components/StudentRegistrationForm";
import StudentProfile from "./components/StudentProfile";
import StudentLogin from "./components/StudentLogin";
import CompanyLogin from "./components/CompanyLogin";
import CollegeLogin from "./components/CollegeLogin";
import ParentLogin from "./components/ParentLogin";

import StudentPortal from "./portals/student/StudentPortal";
import ParentPortal from "./portals/parent/ParentPortal";
import CollegePortal from "./portals/college/CollegePortal";
import CompanyPortal from "./portals/company/CompanyPortal";

import "./App.css";

const FeatureView = lazy(() => import("./components/FeatureView"));
const JobsPage = lazy(() => import("./components/JobsPage"));
const AchievementWallPage = lazy(() => import("./components/AchievementWallPage"));
const Leaderboard = lazy(() => import("./components/Leaderboard"));
const InterviewRequest = lazy(() => import("./components/InterviewRequest"));

function PageLoader() {
  return (
    <div className="vm-page vm-loader">
      <div className="vm-loader-box">
        <div className="vm-spinner" />
        <p>Loading VidyaMarg...</p>
      </div>
    </div>
  );
}

function App() {
  const [languageChosen, setLanguageChosen] = useState(
    () => !!localStorage.getItem("appLanguage")
  );

  const handleLanguageSelect = () => {
    localStorage.setItem("appLanguage", "true");
    setLanguageChosen(true);
  };

  return (
    <Router>
      <OfflineBanner />
      <InstallPrompt />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/language"
            element={<LanguageSelect onLanguageSelected={handleLanguageSelect} />}
          />

          <Route
            path="/portal"
            element={
              languageChosen ? (
                <PortalSelect />
              ) : (
                <LanguageSelect onLanguageSelected={handleLanguageSelect} />
              )
            }
          />

          <Route path="/student" element={<StudentPortal />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/register" element={<StudentRegistrationForm />} />
          <Route path="/student/profile/:id" element={<StudentProfile />} />
          <Route path="/student/jobs" element={<JobsPage />} />
          <Route path="/student/achievements" element={<AchievementWallPage />} />
          <Route path="/student/leaderboard" element={<Leaderboard />} />
          <Route path="/student/*" element={<StudentPortal />} />

          <Route path="/register" element={<Navigate to="/student/register" replace />} />
          <Route path="/profile/:id" element={<StudentProfile />} />
          <Route path="/profile/:id/:featureId" element={<FeatureView />} />
          <Route path="/jobs" element={<Navigate to="/student/jobs" replace />} />
          <Route path="/achievements" element={<Navigate to="/student/achievements" replace />} />
          <Route path="/leaderboard" element={<Navigate to="/student/leaderboard" replace />} />

          <Route path="/parent" element={<ParentPortal />} />
          <Route path="/parent/login" element={<ParentLogin initialMode="login" />} />
          <Route path="/parent/register" element={<ParentLogin initialMode="register" />} />
          <Route path="/parent/*" element={<ParentPortal />} />

          <Route path="/college" element={<CollegePortal />} />
          <Route path="/college/login" element={<CollegeLogin initialMode="login" />} />
          <Route path="/college/register" element={<CollegeLogin initialMode="register" />} />
          <Route path="/college/*" element={<CollegePortal />} />

          <Route path="/company" element={<CompanyPortal />} />
          <Route path="/company/login" element={<CompanyLogin initialMode="login" />} />
          <Route path="/company/register" element={<CompanyLogin initialMode="register" />} />
          <Route path="/company/interview" element={<ProtectedRoute><InterviewRequest /></ProtectedRoute>} />
          <Route path="/company/*" element={<CompanyPortal />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
