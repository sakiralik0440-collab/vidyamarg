import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  sendInterviewRequestAPI,
  getCompanyInterviewsAPI,
} from "../api/studentApi";

function InterviewRequest() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const studentId = searchParams.get("studentId");
  const studentName = searchParams.get("studentName");
  const token = localStorage.getItem("companyToken");
  const companyInfo = JSON.parse(localStorage.getItem("companyInfo") || "{}");

  const [activeTab, setActiveTab] = useState(studentId ? "send" : "history");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [sentRequests, setSentRequests] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [form, setForm] = useState({
    studentId: studentId || "",
    jobTitle: "",
    jobDescription: "",
    salary: "",
    interviewDate: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/company/login");
      return;
    }
    if (activeTab === "history") {
      fetchSentRequests();
    }
  }, [activeTab]);

  const fetchSentRequests = async () => {
    setLoadingHistory(true);
    try {
      const data = await getCompanyInterviewsAPI(token);
      setSentRequests(data.interviews);
    } catch (err) {
      console.error("Failed to fetch:", err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setMessage("");
    try {
      await sendInterviewRequestAPI(form, token);
      setMessage("✅ Interview request sent! Family has been notified via SMS.");
      setForm((prev) => ({
        ...prev,
        jobTitle: "",
        jobDescription: "",
        salary: "",
        interviewDate: "",
      }));
      setTimeout(() => {
        navigate("/company/dashboard");
      }, 2000);
    } catch (err) {
      setMessage("❌ Failed: " + err.message);
    } finally {
      setSending(false);
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

  return (
    <div className="min-h-screen bg-blue-50">

      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div>
          <button
            onClick={() => navigate("/company/dashboard")}
            className="text-blue-600 text-sm underline mb-1 block"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-xl font-bold text-blue-700">
            💼 Interview Requests
          </h1>
        </div>
        <p className="text-sm text-gray-400">{companyInfo.companyName}</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "send", label: "📨 Send Request" },
            { key: "history", label: "📋 Request History" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-blue-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Send Request Tab */}
        {activeTab === "send" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-gray-800 mb-1">
              Send Interview Call
            </h2>
            {studentName && (
              <p className="text-sm text-blue-600 mb-4">
                Sending to: <strong>{decodeURIComponent(studentName)}</strong>
              </p>
            )}

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

            <form onSubmit={handleSend}>
              <div className="space-y-4">

                {/* Student ID (hidden if already set) */}
                {!studentId && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Student ID *
                    </label>
                    <input
                      type="text"
                      value={form.studentId}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          studentId: e.target.value,
                        }))
                      }
                      required
                      placeholder="Paste student ID from search results"
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={form.jobTitle}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, jobTitle: e.target.value }))
                    }
                    required
                    placeholder="e.g. Sales Executive"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Job Description
                  </label>
                  <textarea
                    value={form.jobDescription}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        jobDescription: e.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Describe the role, responsibilities, and requirements"
                    className="w-full border rounded px-3 py-2 text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Salary Offered
                    </label>
                    <input
                      type="text"
                      value={form.salary}
                      onChange={(e) =>
                        setForm((prev) => ({
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
                      Interview Date
                    </label>
                    <input
                      type="date"
                      value={form.interviewDate}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          interviewDate: e.target.value,
                        }))
                      }
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* Preview of SMS that will be sent */}
                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
                  <p className="font-medium mb-1">📱 SMS Preview (sent to family):</p>
                  <p className="italic">
                    [VidyaMarg] 🎉 OPPORTUNITY: {studentName ? decodeURIComponent(studentName) : "Student"} has received an interview call from{" "}
                    {companyInfo.companyName} for {form.jobTitle || "the position"}.
                    Salary: {form.salary || "Not specified"}.
                    Please respond via VidyaMarg app.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {sending
                    ? "Sending request + SMS..."
                    : "📨 Send Interview Request"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="font-semibold text-gray-800">
                All Interview Requests ({sentRequests.length})
              </h2>
            </div>

            {loadingHistory ? (
              <div className="p-8 text-center text-gray-400">
                Loading requests...
              </div>
            ) : sentRequests.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <p className="text-4xl mb-3">📋</p>
                <p>No interview requests sent yet</p>
                <button
                  onClick={() => setActiveTab("send")}
                  className="mt-3 text-blue-600 text-sm underline"
                >
                  Send your first request →
                </button>
              </div>
            ) : (
              <div className="divide-y">
                {sentRequests.map((req) => (
                  <div key={req._id} className="px-6 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">
                          {req.student?.name || "Unknown Student"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {req.jobTitle}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {req.student?.village}, {req.student?.district} ·
                          Score: {req.student?.activityScore}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(req.status)}`}
                        >
                          {req.status}
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(req.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewRequest;