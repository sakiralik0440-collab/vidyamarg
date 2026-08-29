import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAtRiskStudentsAPI } from "../api/studentApi";
import StudentCard from "./StudentCard";

function AtRiskStudents() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchAtRisk = async () => {
      try {
        const data = await getAtRiskStudentsAPI(token);
        setStudents(data.students);
      } catch (err) {
        console.error("Failed to fetch at-risk students:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAtRisk();
  }, []);

  const filtered = students.filter((s) => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  const atRiskCount = students.filter((s) => s.status === "At Risk").length;
  const dropoutCount = students.filter((s) => s.status === "Dropout").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-gray-500">{t("dashboard.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">

      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-green-800">
            ⚠️ Students Needing Attention (At-Risk Monitor)
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/college/dashboard")}
            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-all"
          >
            🏫 Open College Portal
          </button>
          <button
            onClick={() => navigate("/")}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-3 py-1.5 rounded-lg transition-all"
          >
            🏠 Portals Hub
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-gray-800">{students.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Needing Attention</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4 text-center border border-yellow-200">
            <p className="text-3xl font-bold text-yellow-700">{atRiskCount}</p>
            <p className="text-sm text-yellow-600 mt-1">At Risk</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4 text-center border border-red-200">
            <p className="text-3xl font-bold text-red-700">{dropoutCount}</p>
            <p className="text-sm text-red-600 mt-1">Dropout</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {["all", "At Risk", "Dropout"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === tab
                  ? "bg-green-700 text-white"
                  : "bg-white text-gray-600 hover:bg-green-50"
              }`}
            >
              {tab === "all" ? "All" : tab}
              <span className="ml-2 text-xs">
                ({tab === "all"
                  ? students.length
                  : students.filter((s) => s.status === tab).length})
              </span>
            </button>
          ))}
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filtered.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-green-600 text-lg font-medium">
                🎉 No students need attention right now!
              </p>
              <p className="text-gray-400 text-sm mt-2">
                All students are active and on track.
              </p>
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
                  {filtered.map((student) => (
                    <StudentCard
                      key={student._id}
                      student={student}
                      highlight={true}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AtRiskStudents;