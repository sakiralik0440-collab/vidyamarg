import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  searchStudentsAPI,
  postJobAPI,
  getAllJobsAPI,
} from "../api/studentApi";

function CompanyDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const companyInfo = JSON.parse(
    localStorage.getItem("companyInfo") || "{}"
  );
  const token = localStorage.getItem("companyToken");

  const [activeTab, setActiveTab] = useState("search");
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [searching, setSearching] = useState(false);
  const [interviewSent, setInterviewSent] = useState({});

  const [filters, setFilters] = useState({
    minActivityScore: 0,
    stream: "",
    category: "",
    district: "",
    status: "Active",
  });

  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    salary: "",
    minMarks: "",
    minActivityScore: "",
    stream: "",
  });

  const [jobPosting, setJobPosting] = useState(false);
  const [jobMessage, setJobMessage] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/company/login");
      return;
    }
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await getAllJobsAPI();
      setJobs(
        data.jobs.filter(
          (j) => j.companyId === companyInfo.id
        )
      );
    } catch (err) {
      console.error("Failed to fetch jobs:", err.message);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "" && v !== 0)
      );
      const data = await searchStudentsAPI(activeFilters, token);
      setStudents(data.students);
    } catch (err) {
      console.error("Search failed:", err.message);
    } finally {
      setSearching(false);
    }
  };

  const handleSendInterview = (studentId, studentName) => {
    navigate(
      `/company/interview?studentId=${studentId}&studentName=${encodeURIComponent(studentName)}`
    );
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setJobPosting(true);
    setJobMessage("");
    try {
      await postJobAPI(jobForm, token);
      setJobMessage("✅ Job posted successfully!");
      setJobForm({
        title: "",
        description: "",
        salary: "",
        minMarks: "",
        minActivityScore: "",
        stream: "",
      });
      fetchJobs();
      setTimeout(() => setJobMessage(""), 4000);
    } catch (err) {
      setJobMessage("❌ Failed: " + err.message);
    } finally {
      setJobPosting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("companyToken");
    localStorage.removeItem("companyInfo");
    navigate("/company/login");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Graduated": return "bg-purple-100 text-purple-800";
      case "Placed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">

      {/* Navigation */}
      <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-blue-700">
            🏢 {companyInfo.companyName || "Company Dashboard"}
          </h1>
          <p className="text-sm text-gray-400">
            {t("company.welcome")} — {companyInfo.location}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-600 transition"
        >
          {t("company.logout")}
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "search", label: `🔍 ${t("company.searchStudents")}` },
            { key: "jobs", label: `💼 ${t("company.activeJobs")} (${jobs.length})` },
            { key: "post", label: `➕ ${t("company.postJob")}` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-blue-50"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Students Tab */}
        {activeTab === "search" && (
          <div>
            {/* Search Filters */}
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-lg shadow p-5 mb-6"
            >
              <h2 className="font-semibold text-gray-700 mb-4">
                🔍 Filter Students
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {t("company.minActivityScore")}
                  </label>
                  <input
                    type="number"
                    value={filters.minActivityScore}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minActivityScore: e.target.value,
                      }))
                    }
                    min="0"
                    max="100"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {t("company.stream")}
                  </label>
                  <select
                    value={filters.stream}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        stream: e.target.value,
                      }))
                    }
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="">All Streams</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="">All Categories</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={filters.district}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        district: e.target.value,
                      }))
                    }
                    placeholder="e.g. Hoshangabad"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="Active">Active Students</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Placed">Already Placed</option>
                    <option value="all">All</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={searching}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {searching ? "Searching..." : t("company.search")}
              </button>
            </form>

            {/* Search Results */}
            {students.length > 0 && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h2 className="font-semibold text-gray-800">
                    Found {students.length} students
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-blue-50 text-gray-500 uppercase text-xs">
                      <tr>
                        <th className="px-6 py-3 text-left">Name</th>
                        <th className="px-6 py-3 text-left">Location</th>
                        <th className="px-6 py-3 text-left">Class/Stream</th>
                        <th className="px-6 py-3 text-left">Status</th>
                        <th className="px-6 py-3 text-left">Activity Score</th>
                        <th className="px-6 py-3 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {students.map((student) => (
                        <tr key={student._id} className="hover:bg-blue-50">
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-800">
                              {student.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {student.category}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            <p>{student.village}</p>
                            <p className="text-xs">{student.district}</p>
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            <p>{student.currentClass}</p>
                            <p className="text-xs">{student.stream}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(student.status)}`}
                            >
                              {student.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${student.activityScore}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-blue-700">
                                {student.activityScore}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                handleSendInterview(student._id, student.name)
                              }
                              className={`text-xs px-3 py-1.5 rounded font-medium transition ${interviewSent[student._id]
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                            >
                              {interviewSent[student._id]
                                ? "✅ Sent!"
                                : t("company.sendInterview")}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {students.length === 0 && !searching && (
              <div className="bg-white rounded-lg shadow p-12 text-center text-gray-400">
                <p className="text-4xl mb-3">🔍</p>
                <p>Use the filters above to search for students</p>
              </div>
            )}
          </div>
        )}

        {/* Active Jobs Tab */}
        {activeTab === "jobs" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="font-semibold text-gray-800">
                💼 {t("company.activeJobs")}
              </h2>
            </div>
            {jobs.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <p className="text-4xl mb-3">💼</p>
                <p>No jobs posted yet</p>
                <button
                  onClick={() => setActiveTab("post")}
                  className="mt-3 text-blue-600 text-sm underline"
                >
                  Post your first job →
                </button>
              </div>
            ) : (
              <div className="divide-y">
                {jobs.map((job, index) => (
                  <div key={index} className="px-6 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">{job.title}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {job.description}
                        </p>
                        <div className="flex gap-3 mt-2 text-xs text-gray-400">
                          {job.salary && <span>💰 {job.salary}</span>}
                          {job.stream && <span>📚 {job.stream}</span>}
                          {job.minActivityScore && (
                            <span>⚡ Min Score: {job.minActivityScore}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(job.postedAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Post Job Tab */}
        {activeTab === "post" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-gray-800 mb-4">
              ➕ {t("company.postJob")}
            </h2>

            {jobMessage && (
              <p
                className={`text-sm mb-4 px-3 py-2 rounded ${jobMessage.startsWith("✅")
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                  }`}
              >
                {jobMessage}
              </p>
            )}

            <form onSubmit={handlePostJob}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {t("company.jobTitle")} *
                  </label>
                  <input
                    type="text"
                    value={jobForm.title}
                    onChange={(e) =>
                      setJobForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    required
                    placeholder="e.g. Sales Executive"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {t("company.jobDescription")}
                  </label>
                  <textarea
                    value={jobForm.description}
                    onChange={(e) =>
                      setJobForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Describe the role and responsibilities"
                    className="w-full border rounded px-3 py-2 text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {t("company.salary")}
                  </label>
                  <input
                    type="text"
                    value={jobForm.salary}
                    onChange={(e) =>
                      setJobForm((prev) => ({
                        ...prev,
                        salary: e.target.value,
                      }))
                    }
                    placeholder="e.g. ₹12,000/month"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {t("company.stream")}
                  </label>
                  <select
                    value={jobForm.stream}
                    onChange={(e) =>
                      setJobForm((prev) => ({
                        ...prev,
                        stream: e.target.value,
                      }))
                    }
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="">Any Stream</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Min. Marks (%)
                  </label>
                  <input
                    type="number"
                    value={jobForm.minMarks}
                    onChange={(e) =>
                      setJobForm((prev) => ({
                        ...prev,
                        minMarks: e.target.value,
                      }))
                    }
                    min="0"
                    max="100"
                    placeholder="e.g. 55"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Min. Activity Score
                  </label>
                  <input
                    type="number"
                    value={jobForm.minActivityScore}
                    onChange={(e) =>
                      setJobForm((prev) => ({
                        ...prev,
                        minActivityScore: e.target.value,
                      }))
                    }
                    min="0"
                    max="100"
                    placeholder="e.g. 60"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={jobPosting}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {jobPosting ? "Posting..." : t("company.postButton")}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyDashboard;