import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getStudentInterviewsAPI, updateInterviewStatusAPI } from "../api/studentApi";

function InterviewNotifications({ studentId }) {
  const { t } = useTranslation();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchInterviews();
  }, [studentId]);

  const fetchInterviews = async () => {
    try {
      const data = await getStudentInterviewsAPI(studentId);
      setInterviews(data.interviews);
    } catch (err) {
      console.error("Failed to fetch interviews:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (interviewId, status) => {
    setUpdating((prev) => ({ ...prev, [interviewId]: true }));
    try {
      await updateInterviewStatusAPI(interviewId, status);
      setMessage(
        status === "Accepted"
          ? "✅ Interview accepted! Company will contact you soon."
          : "Interview request declined."
      );
      fetchInterviews();
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setMessage("❌ Failed: " + err.message);
    } finally {
      setUpdating((prev) => ({ ...prev, [interviewId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Accepted": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      case "Interviewed": return "bg-blue-100 text-blue-800";
      case "Hired": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return null;
  if (interviews.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow mb-4">

      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-blue-700">
          💼 Interview Opportunities
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">
          {interviews.filter((i) => i.status === "Pending").length} pending
          request(s)
        </p>
      </div>

      <div className="p-6">

        {message && (
          <div
            className={`text-sm px-4 py-3 rounded-lg mb-4 ${
              message.startsWith("✅")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="space-y-4">
          {interviews.map((interview) => (
            <div
              key={interview._id}
              className={`border rounded-lg p-4 ${
                interview.status === "Pending"
                  ? "border-yellow-300 bg-yellow-50"
                  : interview.status === "Hired"
                  ? "border-purple-300 bg-purple-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-800">
                    {interview.company?.companyName || "Company"}
                  </p>
                  <p className="text-sm text-blue-700 font-medium">
                    {interview.jobTitle}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    📍 {interview.company?.location}
                    {interview.company?.industryType &&
                      ` · ${interview.company.industryType}`}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(interview.status)}`}
                >
                  {interview.status}
                </span>
              </div>

              {/* Company contact */}
              {interview.company?.phone && (
                <p className="text-xs text-gray-500 mb-3">
                  📞 Contact:{" "}
                  <a
                    href={`tel:${interview.company.phone}`}
                    className="text-blue-600 underline"
                  >
                    {interview.company.phone}
                  </a>
                </p>
              )}

              <p className="text-xs text-gray-400 mb-3">
                Received:{" "}
                {new Date(interview.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              {/* Action buttons for pending requests */}
              {interview.status === "Pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      handleStatusUpdate(interview._id, "Accepted")
                    }
                    disabled={updating[interview._id]}
                    className="flex-1 bg-green-600 text-white py-2 rounded text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {updating[interview._id] ? "..." : "✅ Accept"}
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(interview._id, "Rejected")
                    }
                    disabled={updating[interview._id]}
                    className="flex-1 border border-red-300 text-red-600 py-2 rounded text-sm hover:bg-red-50 transition disabled:opacity-50"
                  >
                    {updating[interview._id] ? "..." : "❌ Decline"}
                  </button>
                </div>
              )}

              {/* Hired message */}
              {interview.status === "Hired" && (
                <div className="bg-purple-100 rounded p-2 text-center">
                  <p className="text-purple-700 font-semibold text-sm">
                    🎉 Congratulations! You are placed at{" "}
                    {interview.company?.companyName}!
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InterviewNotifications;