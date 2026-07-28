import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getAllJobsAPI } from "../api/studentApi";

function JobsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const fetchAllJobs = async () => {
    try {
      const data = await getAllJobsAPI();
      setJobs(data.jobs);
    } catch (err) {
      console.error("Failed to fetch jobs:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      (job.jobTitle || job.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-blue-50">

      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-blue-700">
              💼 {t("jobs.title")}
            </h1>
            <p className="text-sm text-gray-400">
              {jobs.length} active opportunities
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-400 hover:text-blue-600 underline"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border rounded-lg px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">
            Loading jobs...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">💼</p>
            <p className="text-gray-400">
              {searchTerm
                ? "No jobs match your search"
                : "No active jobs posted yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job, index) => {
              const jobKey = `${job.companyId}-${index}`;
              const isExpanded = expandedJob === jobKey;

              return (
                <div
                  key={jobKey}
                  className={`bg-white border rounded-lg overflow-hidden shadow-sm transition ${
                    isExpanded ? "border-blue-400" : "border-gray-200"
                  }`}
                >
                  <div
                    className="p-5 cursor-pointer hover:bg-blue-50 transition"
                    onClick={() =>
                      setExpandedJob(isExpanded ? null : jobKey)
                    }
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800 text-base">
                          {job.jobTitle || job.title}
                        </p>
                        <p className="text-blue-600 font-medium text-sm mt-0.5">
                          {job.companyName}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          📍 {job.companyLocation}
                        </p>
                      </div>
                      <div className="text-right">
                        {job.salary && (
                          <p className="text-green-700 font-semibold text-sm">
                            💰 {job.salary}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(job.postedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-3 text-xs text-gray-400 flex-wrap">
                      {job.minActivityScore > 0 && (
                        <span>⚡ Min Score: {job.minActivityScore}</span>
                      )}
                      {job.minMarks > 0 && (
                        <span>📊 Min Marks: {job.minMarks}%</span>
                      )}
                      {job.stream && <span>📚 {job.stream}</span>}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t bg-gray-50 p-5">
                      {job.description && (
                        <p className="text-sm text-gray-600 mb-4">
                          {job.description}
                        </p>
                      )}
                      <div className="flex gap-3">
                        {job.companyPhone && (
                          <a
                            href={`tel:${job.companyPhone}`}
                            className="flex-1 text-center bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                          >
                            📞 Contact Company
                          </a>
                        )}
                        <button
                          onClick={() => navigate(-1)}
                          className="flex-1 text-center border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobsPage;