import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDebounce } from "../hooks/useDebounce";
import StudentCard from "./StudentCard";

import {
  getFilteredStudentsAPI,
  getStatsAPI,
  runDetectionAPI,
} from "../api/studentApi";

function TeacherDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { teacher, token, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detectionRunning, setDetectionRunning] = useState(false);
  const [detectionMessage, setDetectionMessage] = useState("");
  const [interviewStats, setInterviewStats] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    stream: "",
    category: "",
  });

  // Debounce search — only fires API after user stops typing 500ms
  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch stats and students on load
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Re-fetch students when filters change (debounced search)
  useEffect(() => {
    fetchStudents();
  }, [filters.status, filters.stream, filters.category, debouncedSearch]);

  const fetchDashboardData = async () => {
    try {
      const [statsData, studentsData, interviewData] = await Promise.all([
        getStatsAPI(token),
        getFilteredStudentsAPI({}, token),
        fetch(`https://vidyamarg-backend.onrender.com//api/interviews/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json()),
      ]);
      setStats(statsData.stats);
      setStudents(studentsData.students);
      setInterviewStats(interviewData.stats);
    } catch (err) {
      console.error("Dashboard load failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const activeFilters = Object.fromEntries(
        Object.entries({
          ...filters,
          search: debouncedSearch,
        }).filter(([_, v]) => v !== "")
      );
      const data = await getFilteredStudentsAPI(activeFilters, token);
      setStudents(data.students);
    } catch (err) {
      console.error("Filter failed:", err.message);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRunDetection = async () => {
    setDetectionRunning(true);
    setDetectionMessage("");
    try {
      const data = await runDetectionAPI(token);
      setDetectionMessage(
        `${t("dashboard.detectionDone")} — Updated: ${data.updatedCount} students`
      );
      fetchDashboardData();
    } catch (err) {
      setDetectionMessage("Detection failed: " + err.message);
    } finally {
      setDetectionRunning(false);
    }
  };

  const handleRecalculateScores = async () => {
    try {
      const response = await fetch(
        "https://vidyamarg-production-50d6.up.railway.app/api/dropout/recalculate-scores",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setDetectionMessage(
        `⚡ Scores recalculated — ${data.updated} students updated`
      );
      fetchDashboardData();
    } catch (err) {
      setDetectionMessage("Recalculation failed: " + err.message);
    }
  };

  const handleAutoCertificates = async () => {
    try {
      const { autoGenerateCertificatesAPI } = await import("../api/studentApi");
      const data = await autoGenerateCertificatesAPI("2023-2024", token);
      setDetectionMessage(`🏅 ${data.message}`);
    } catch (err) {
      setDetectionMessage("Certificate generation failed: " + err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/teacher/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-gray-500">{t("dashboard.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">

      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm px-4 py-4">
        <div className="max-w-6xl mx-auto">

          {/* Title + Logout Row */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <h1 className="text-xl font-bold text-green-800">
                🎓 {t("dashboard.title")}
              </h1>
              <p className="text-sm text-gray-500">
                {t("dashboard.welcome")}, {teacher?.name}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-600 transition"
            >
              {t("dashboard.logout")}
            </button>
          </div>

          {/* Action Buttons — horizontally scrollable on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <button
              onClick={() => navigate("/at-risk")}
              className="text-xs bg-yellow-100 text-yellow-700 px-3 py-2 rounded hover:bg-yellow-200 transition whitespace-nowrap flex-shrink-0"
            >
              ⚠️ At Risk ({(stats?.atRisk || 0) + (stats?.dropout || 0)})
            </button>

            <button
              onClick={handleRunDetection}
              disabled={detectionRunning}
              className="text-xs bg-green-100 text-green-800 px-3 py-2 rounded hover:bg-green-200 transition disabled:opacity-50 whitespace-nowrap flex-shrink-0"
            >
              {detectionRunning
                ? t("dashboard.detectionRunning")
                : t("dashboard.runDetection")}
            </button>

            <button
              onClick={() => navigate("/leaderboard")}
              className="text-xs bg-purple-100 text-purple-700 px-3 py-2 rounded hover:bg-purple-200 transition whitespace-nowrap flex-shrink-0"
            >
              🏆 Leaderboard
            </button>

            <button
              onClick={() => navigate("/district")}
              className="text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 transition whitespace-nowrap flex-shrink-0"
            >
              🗺️ District View
            </button>

            <button
              onClick={() => navigate("/achievements")}
              className="text-xs bg-yellow-100 text-yellow-700 px-3 py-2 rounded hover:bg-yellow-200 transition whitespace-nowrap flex-shrink-0"
            >
              🏆 Achievement Wall
            </button>

            <button
              onClick={() => navigate("/helpline")}
              className="text-xs bg-purple-100 text-purple-700 px-3 py-2 rounded hover:bg-purple-200 transition whitespace-nowrap flex-shrink-0"
            >
              🔒 Helpline
            </button>

            <button
              onClick={() => navigate("/colleges")}
              className="text-xs bg-blue-100 text-blue-700 px-3 py-2 rounded hover:bg-blue-200 transition whitespace-nowrap flex-shrink-0"
            >
              🎓 Manage Colleges
            </button>

            <button
              onClick={handleRecalculateScores}
              className="text-xs bg-indigo-100 text-indigo-700 px-3 py-2 rounded hover:bg-indigo-200 transition whitespace-nowrap flex-shrink-0"
            >
              ⚡ Recalculate Scores
            </button>

            <button
              onClick={handleAutoCertificates}
              className="text-xs bg-green-100 text-green-700 px-3 py-2 rounded hover:bg-green-200 transition whitespace-nowrap flex-shrink-0"
            >
              🏅 Auto Certificates
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Detection / Action Message */}
        {detectionMessage && (
          <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <span>✅ {detectionMessage}</span>
            <button
              onClick={() => setDetectionMessage("")}
              className="text-green-400 hover:text-green-600 ml-3"
            >
              ×
            </button>
          </div>
        )}

        {/* Student Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <StatCard
              label={t("dashboard.totalStudents")}
              value={stats.total}
              color="bg-green-600"
            />
            <StatCard
              label={t("dashboard.activeStudents")}
              value={stats.active}
              color="bg-green-500"
            />
            <StatCard
              label={t("dashboard.atRiskStudents")}
              value={stats.atRisk}
              color="bg-yellow-500"
            />
            <StatCard
              label={t("dashboard.dropoutStudents")}
              value={stats.dropout}
              color="bg-red-500"
            />
            <StatCard
              label={t("dashboard.placedStudents")}
              value={stats.placed}
              color="bg-blue-500"
            />
          </div>
        )}

        {/* Interview Stats Cards */}
        {interviewStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total Interviews"
              value={interviewStats.total}
              color="bg-blue-500"
            />
            <StatCard
              label="Pending"
              value={interviewStats.pending}
              color="bg-yellow-500"
            />
            <StatCard
              label="Accepted"
              value={interviewStats.accepted}
              color="bg-green-500"
            />
            <StatCard
              label="Hired 🎉"
              value={interviewStats.hired}
              color="bg-purple-500"
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Search — debounced */}
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder={t("dashboard.searchPlaceholder")}
              className="border rounded px-3 py-2 text-sm"
            />

            {/* Status Filter */}
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">{t("dashboard.filterByStatus")}</option>
              <option value="Active">{t("profile.active")}</option>
              <option value="At Risk">{t("profile.atRisk")}</option>
              <option value="Dropout">{t("profile.dropout")}</option>
              <option value="Placed">{t("profile.placed")}</option>
              <option value="Graduated">{t("profile.graduated")}</option>
            </select>

            {/* Stream Filter */}
            <select
              name="stream"
              value={filters.stream}
              onChange={handleFilterChange}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">{t("dashboard.filterByStream")}</option>
              <option value="Science">{t("registration.science")}</option>
              <option value="Commerce">{t("registration.commerce")}</option>
              <option value="Arts">{t("registration.arts")}</option>
              <option value="Not Applicable">
                {t("registration.notApplicable")}
              </option>
            </select>

            {/* Category Filter */}
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">{t("dashboard.filterByCategory")}</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">
              {t("dashboard.allStudents")} ({students.length})
            </h2>
          </div>

          {students.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              {t("dashboard.noStudents")}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-green-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Village / District</th>
                    <th className="px-6 py-3 text-left">Class / Stream</th>
                    <th className="px-6 py-3 text-left">Category</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Score</th>
                    <th className="px-6 py-3 text-left">Registered</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student) => (
                    <StudentCard
                      key={student._id}
                      student={student}
                      highlight={false}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Info */}
          <div className="px-6 py-4 border-t flex justify-between items-center text-sm text-gray-500">
            <span>Showing {students.length} students</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// Reusable stat card
function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 text-center">
      <div
        className={`text-2xl font-bold text-white ${color} rounded-lg py-2 mb-2`}
      >
        {value}
      </div>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

export default TeacherDashboard;