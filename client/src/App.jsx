import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LanguageSelect from "./components/LanguageSelect";
import StudentRegistrationForm from "./components/StudentRegistrationForm";
import StudentProfile from "./components/StudentProfile";
import TeacherLogin from "./components/TeacherLogin";
import TeacherDashboard from "./components/TeacherDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AtRiskStudents from "./components/AtRiskStudents";
import "./App.css";

function App() {
  const [languageChosen, setLanguageChosen] = useState(
    !!localStorage.getItem("appLanguage")
  );

  if (!languageChosen) {
    return <LanguageSelect onLanguageSelected={() => setLanguageChosen(true)} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<StudentRegistrationForm />} />
        <Route path="/profile/:id" element={<StudentProfile />} />
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/at-risk"
          element={
            <ProtectedRoute>
              <AtRiskStudents />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
