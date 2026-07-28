import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getMatchingJobsAPI, sendInterviewRequestAPI } from "../api/studentApi";

function JobOpportunities({ student }) {
  const { t } = useTranslation();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [applyMessage, setApplyMessage] = useState("");

  useEffect(() => {
    if (student) fetchMatchingJobs();
  }, [student]);

  const fetchMatchingJobs = async () => {
    try {
      const data = await getMatchingJobsAPI({
        activityScore: student.activityScore || 0,
        marksPercentage: 60, // default — will update with real marks later
        stream: student.stream || "",
      });
      setJobs(data.jobs);
    } catch (err) {
      console.error("Failed to fetch jobs:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowInterest = async (job) => {
    const jobKey = `${job.companyId}-${job._id}`;
    setAppliedJobs((prev) => ({ ...prev, [jobKey]: true }));
    setApplyMessage(
      `✅ Interest shown for ${job.jobTitle || job.title} at ${job.companyName}! ` +
      `Company may contact you soon.`
    );
    setTimeout(() => setApplyMessage(""), 5000);
  };

  const getMatchLabel = (score) => {
    if (score >= 70)
      return {
        label: t("jobs.excellent"),
        color: "bg-green-100 text-green-700",
      };
    if (score >= 50)
      return { label: t("jobs.good"), color: "bg-blue-100 text-blue-700" };
    return { label: t("jobs.fair"), color: "bg-gray-100 text-gray-600" };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <p className="text-gray-400 text-sm">Loading job opportunities...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow mb-4">

      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-blue-700">
          💼 {t("jobs.title")}
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">
          {jobs.length > 0
            ? `${jobs.length} ${t("jobs.subtitle")}`
            : t("jobs.noJobs")}
        </p>
      </div>

      <div className="p-6">

        {/* Your activity score context */}
        <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3 mb-5">
          <div className="text-2xl font-bold text-blue-700">
            {student?.activityScore || 0}
          </div>
          <div>
            <p className="text-sm font-medium text-blue-700">
              {t("jobs.yourScore")}
            </p>
            <p className="text-xs text-gray-400">
              Higher score = more job matches
            </p>
          </div>
          <div className="ml-auto">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${student?.activityScore || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Apply message */}
        {applyMessage && (
          <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4">
            {applyMessage}
          </div>
        )}

        {/* Job Cards */}
        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">💼</p>
            <p className="text-gray-400">{t("jobs.noJobs")}</p>
            <p className="text-gray-300 text-xs mt-2">{t("jobs.noJobsHint")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job, index) => {
              const jobKey = `${job.companyId}-${job._id}`;
              const matchInfo = getMatchLabel(job.matchScore);
              const isExpanded = expandedJob === jobKey;
              const isApplied = appliedJobs[jobKey];

              return (
                <div
                  key={jobKey}
                  className={`border rounded-lg overflow-hidden transition ${
                    isExpanded ? "border-blue-400 shadow-md" : "border-gray-200"
                  }`}
                >
                  {/* Job Card Header */}
                  <div
                    className="p-4 cursor-pointer hover:bg-blue-50 transition"
                    onClick={() =>
                      setExpandedJob(isExpanded ? null : jobKey)
                    }
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-800">
                            {job.jobTitle || job.title}
                          </p>
                          {job.isVerified && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                              ✓ {t("jobs.verified")}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-blue-700 font-medium">
                          {job.companyName}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          📍 {job.companyLocation}
                          {job.companyIndustry &&
                            ` · ${job.companyIndustry}`}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${matchInfo.color}`}
                        >
                          {matchInfo.label}
                        </span>
                        {job.salary && (
                          <span className="text-xs text-green-700 font-medium">
                            💰 {job.salary}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick requirements */}
                    <div className="flex gap-3 mt-3 text-xs text-gray-400">
                      {job.minActivityScore > 0 && (
                        <span>
                          ⚡ Min Score:{" "}
                          <span
                            className={
                              student?.activityScore >= job.minActivityScore
                                ? "text-green-600 font-medium"
                                : "text-red-500 font-medium"
                            }
                          >
                            {job.minActivityScore}
                          </span>
                        </span>
                      )}
                      {job.minMarks > 0 && (
                        <span>📊 Min Marks: {job.minMarks}%</span>
                      )}
                      {job.stream && (
                        <span>📚 {job.stream}</span>
                      )}
                      <span>
                        📅 {formatDate(job.postedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t bg-gray-50 p-4">
                      {job.description && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-400 uppercase mb-1">
                            Job Description
                          </p>
                          <p className="text-sm text-gray-700">
                            {job.description}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        {job.salary && (
                          <div>
                            <p className="text-xs text-gray-400 uppercase mb-1">
                              {t("jobs.salary")}
                            </p>
                            <p className="font-medium text-green-700">
                              {job.salary}
                            </p>
                          </div>
                        )}
                        {job.companyPhone && (
                          <div>
                            <p className="text-xs text-gray-400 uppercase mb-1">
                              {t("jobs.contact")}
                            </p>
                            <a
                              href={`tel:${job.companyPhone}`}
                              className="text-blue-600 underline text-sm"
                            >
                              {job.companyPhone}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Match Score Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>{t("jobs.matchScore")}</span>
                          <span>{job.matchScore}/100</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${job.matchScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleShowInterest(job)}
                          disabled={isApplied}
                          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                            isApplied
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          } disabled:cursor-default`}
                        >
                          {isApplied
                            ? t("jobs.applied")
                            : t("jobs.apply")}
                        </button>
                        {job.companyPhone && (
                          <a
                            href={`tel:${job.companyPhone}`}
                            className="flex-1 text-center border border-blue-300 text-blue-600 py-2.5 rounded-lg text-sm hover:bg-blue-50 transition"
                          >
                            📞 {t("jobs.contact")}
                          </a>
                        )}
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

export default JobOpportunities;