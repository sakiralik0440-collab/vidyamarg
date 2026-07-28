import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getParentDashboardAPI,
  updateInterviewStatusAPI,
} from "../api/studentApi";

function ParentDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingInterview, setUpdatingInterview] = useState({});
  const [interviewMessage, setInterviewMessage] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, [id]);

  const fetchDashboard = async () => {
    try {
      const data = await getParentDashboardAPI(id);
      setDashboard(data.dashboard);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewAction = async (interviewId, status) => {
    setUpdatingInterview((prev) => ({ ...prev, [interviewId]: true }));
    try {
      await updateInterviewStatusAPI(interviewId, status);
      setInterviewMessage(
        status === "Accepted"
          ? "✅ Interview accepted! Company will contact you."
          : "Interview declined."
      );
      fetchDashboard();
      setTimeout(() => setInterviewMessage(""), 4000);
    } catch (err) {
      setInterviewMessage("❌ Failed: " + err.message);
    } finally {
      setUpdatingInterview((prev) => ({ ...prev, [interviewId]: false }));
    }
  };

  const getScoreEmoji = (score) => {
    if (score >= 70) return "🌟";
    if (score >= 40) return "👍";
    return "💪";
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return t("parent.good");
    if (score >= 40) return t("parent.average");
    return t("parent.needsWork");
  };

  const getResultDisplay = (result) => {
    switch (result) {
      case "Pass": return t("parent.pass");
      case "Fail": return t("parent.fail");
      case "Appearing": return t("parent.appearing");
      default: return result;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center">
          <p className="text-6xl mb-4">⏳</p>
          <p className="text-gray-500 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center">
          <p className="text-6xl mb-4">❌</p>
          <p className="text-red-600">{error || "Student not found"}</p>
        </div>
      </div>
    );
  }

  const { student, statusInfo, latestProgress, stats, pendingInterviews } =
    dashboard;

  return (
    <div className="min-h-screen bg-orange-50">

      {/* Header */}
      <div className="bg-orange-600 text-white px-6 py-5 text-center">
        <p className="text-sm opacity-80 mb-1">🎓 VidyaMarg</p>
        <h1 className="text-2xl font-bold">{t("parent.myChild")}</h1>
        <p className="text-xl mt-1">{student.name}</p>
        <p className="text-sm opacity-75 mt-0.5">
          {student.village} · {student.currentClass}
        </p>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">

        {/* BIG STATUS CARD */}
        <div
          className={`rounded-2xl p-6 text-center shadow-md ${
            statusInfo.color === "green"
              ? "bg-green-100 border-2 border-green-400"
              : statusInfo.color === "yellow"
              ? "bg-yellow-100 border-2 border-yellow-400"
              : statusInfo.color === "red"
              ? "bg-red-100 border-2 border-red-400"
              : statusInfo.color === "blue"
              ? "bg-blue-100 border-2 border-blue-400"
              : "bg-purple-100 border-2 border-purple-400"
          }`}
        >
          <p className="text-7xl mb-3">{statusInfo.emoji}</p>
          <p className="text-2xl font-bold text-gray-800 mb-1">
            {lang === "hi" ? statusInfo.hindiMessage : statusInfo.message}
          </p>
          <p className="text-sm text-gray-500">{t("parent.status")}</p>
        </div>

        {/* Interview Notification - PROMINENT */}
        {pendingInterviews?.length > 0 && (
          <div className="bg-blue-100 border-2 border-blue-400 rounded-2xl p-5">
            <p className="text-4xl text-center mb-3">💼</p>
            <p className="text-xl font-bold text-blue-800 text-center mb-1">
              {t("parent.jobOpportunity")}!
            </p>

            {interviewMessage && (
              <p className="text-sm text-center mb-3 text-green-700">
                {interviewMessage}
              </p>
            )}

            {pendingInterviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-white rounded-xl p-4 mb-3"
              >
                <p className="font-bold text-gray-800 text-lg">
                  {interview.company}
                </p>
                <p className="text-blue-700 font-medium">{interview.jobTitle}</p>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() =>
                      handleInterviewAction(interview.id, "Accepted")
                    }
                    disabled={updatingInterview[interview.id]}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl text-base font-bold hover:bg-green-700 transition disabled:opacity-50"
                  >
                    ✅ {t("parent.acceptInterview")}
                  </button>
                  <button
                    onClick={() =>
                      handleInterviewAction(interview.id, "Rejected")
                    }
                    disabled={updatingInterview[interview.id]}
                    className="flex-1 bg-red-100 text-red-700 py-3 rounded-xl text-base font-bold hover:bg-red-200 transition disabled:opacity-50"
                  >
                    ❌ {t("parent.rejectInterview")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LATEST PROGRESS */}
        {latestProgress ? (
          <div className="bg-white rounded-2xl p-5 shadow">
            <p className="text-gray-500 text-sm mb-3 uppercase tracking-wide">
              {latestProgress.className} — {latestProgress.academicYear}
            </p>

            <div className="grid grid-cols-3 gap-3 text-center">
              {/* Marks */}
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-3xl font-bold text-blue-700">
                  {latestProgress.marksPercentage || "—"}
                  {latestProgress.marksPercentage ? "%" : ""}
                </p>
                <p className="text-xs text-gray-500 mt-1">{t("parent.marks")}</p>
              </div>

              {/* Result */}
              <div
                className={`rounded-xl p-3 ${
                  latestProgress.result === "Pass"
                    ? "bg-green-50"
                    : latestProgress.result === "Fail"
                    ? "bg-red-50"
                    : "bg-yellow-50"
                }`}
              >
                <p className="text-2xl font-bold">
                  {latestProgress.result === "Pass"
                    ? "✅"
                    : latestProgress.result === "Fail"
                    ? "❌"
                    : "📝"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {getResultDisplay(latestProgress.result)}
                </p>
              </div>

              {/* Attendance */}
              <div className="bg-orange-50 rounded-xl p-3">
                <p className="text-3xl font-bold text-orange-700">
                  {latestProgress.attendancePercentage || "—"}
                  {latestProgress.attendancePercentage ? "%" : ""}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {t("parent.attendance")}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-5 shadow text-center">
            <p className="text-4xl mb-2">📋</p>
            <p className="text-gray-400">{t("parent.noUpdate")}</p>
          </div>
        )}

        {/* STATS ROW */}
        <div className="grid grid-cols-3 gap-3">
          {/* Years Studied */}
          <div className="bg-white rounded-2xl p-4 text-center shadow">
            <p className="text-4xl font-bold text-orange-600">
              {stats.yearsStudied}
            </p>
            <p className="text-xs text-gray-500 mt-1 leading-tight">
              {t("parent.yearsStudied")}
            </p>
          </div>

          {/* Certificates */}
          <div className="bg-white rounded-2xl p-4 text-center shadow">
            <p className="text-4xl">
              {stats.certificatesEarned > 0 ? "🏅".repeat(Math.min(stats.certificatesEarned, 3)) : "—"}
            </p>
            <p className="text-xs text-gray-500 mt-1 leading-tight">
              {stats.certificatesEarned} {t("parent.certificates")}
            </p>
          </div>

          {/* Activity Score */}
          <div className="bg-white rounded-2xl p-4 text-center shadow">
            <p className="text-4xl">
              {getScoreEmoji(student.activityScore)}
            </p>
            <p className="text-sm font-bold text-gray-700">
              {getScoreLabel(student.activityScore)}
            </p>
            <p className="text-xs text-gray-400">{student.activityScore}/100</p>
          </div>
        </div>

        {/* CONTACT TEACHER */}
        {dashboard.familyContacts?.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow">
            <p className="text-lg font-semibold text-gray-700 mb-3 text-center">
              📞 Family Contacts
            </p>
            <div className="space-y-2">
              {dashboard.familyContacts
                .filter((c) => c.relation === "Teacher")
                .map((contact, i) => (
                 <a 
                    key={i}
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-3 bg-orange-50 rounded-xl p-3 hover:bg-orange-100 transition"
                  >
                    <span className="text-2xl">👨‍🏫</span>
                    <div>
                      <p className="font-medium text-gray-800">{contact.name}</p>
                      <p className="text-sm text-orange-600">{contact.phone}</p>
                    </div>
                    <span className="ml-auto text-orange-600">📞</span>
                  </a>
                ))}
            </div>
          </div>
        )}

        {/* SWITCH TO FULL VIEW */}
        <div className="text-center pb-6">
          <button
            onClick={() => navigate(`/profile/${id}`)}
            className="text-sm text-orange-600 underline"
          >
            {t("parent.switchToFull")} →
          </button>
        </div>
      </div>
    </div>
  );
}

export default ParentDashboard;