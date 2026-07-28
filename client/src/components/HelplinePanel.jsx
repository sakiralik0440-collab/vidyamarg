import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import {
  getAllHelplineRequestsAPI,
  respondToHelplineAPI,
} from "../api/studentApi";

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved: "bg-green-100 text-green-700",
};

const CATEGORY_EMOJIS = {
  Bullying: "😰",
  "Financial Problem": "💸",
  "Family Pressure": "👨‍👩‍👦",
  "Mental Health": "🧠",
  "Academic Stress": "📚",
  "Dropout Risk": "⚠️",
  Other: "💬",
};

function HelplinePanel() {
  const { t } = useTranslation();
  const { token } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("In Progress");
  const [responding, setResponding] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [filter, setFilter] = useState({ status: "", category: "" });

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filter).filter(([_, v]) => v !== "")
      );
      const data = await getAllHelplineRequestsAPI(token, activeFilters);
      setRequests(data.requests);
    } catch (err) {
      console.error("Failed to fetch helpline requests:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (e) => {
    e.preventDefault();
    setResponding(true);
    try {
      await respondToHelplineAPI(
        selectedRequest._id,
        { response, status },
        token
      );
      setResponseMessage("✅ Response sent successfully");
      setSelectedRequest(null);
      setResponse("");
      fetchRequests();
      setTimeout(() => setResponseMessage(""), 3000);
    } catch (err) {
      setResponseMessage("❌ Failed: " + err.message);
    } finally {
      setResponding(false);
    }
  };

  const urgentCount = requests.filter((r) => r.isUrgent).length;
  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  return (
    <div className="min-h-screen bg-purple-50">

      {/* Header */}
      <div className="bg-purple-700 text-white px-6 py-4">
        <h1 className="text-xl font-bold">🔒 Helpline Management</h1>
        <p className="text-sm text-purple-200">
          Anonymous student requests — handle with care
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {responseMessage && (
          <div
            className={`text-sm px-4 py-3 rounded-lg mb-4 ${
              responseMessage.startsWith("✅")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {responseMessage}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-purple-700">{requests.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total Requests</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4 text-center border border-red-200">
            <p className="text-3xl font-bold text-red-700">{urgentCount}</p>
            <p className="text-xs text-red-500 mt-1">🚨 Urgent</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4 text-center border border-yellow-200">
            <p className="text-3xl font-bold text-yellow-700">{pendingCount}</p>
            <p className="text-xs text-yellow-500 mt-1">⏳ Pending</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          <select
            value={filter.status}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, status: e.target.value }))
            }
            className="flex-1 border rounded px-3 py-2 text-sm bg-white"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <select
            value={filter.category}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, category: e.target.value }))
            }
            className="flex-1 border rounded px-3 py-2 text-sm bg-white"
          >
            <option value="">All Categories</option>
            {Object.keys(CATEGORY_EMOJIS).map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_EMOJIS[cat]} {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔒</p>
            <p className="text-gray-400">No helpline requests yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <div
                key={request._id}
                className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                  request.isUrgent
                    ? "border-l-red-500"
                    : request.status === "Pending"
                    ? "border-l-yellow-400"
                    : request.status === "Resolved"
                    ? "border-l-green-400"
                    : "border-l-blue-400"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">
                        {CATEGORY_EMOJIS[request.category]}
                      </span>
                      <p className="font-medium text-gray-800">
                        {request.category}
                      </p>
                      {request.isUrgent && (
                        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">
                          🚨 URGENT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 font-mono">
                      {request.anonymousId}
                    </p>
                    {request.district && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        📍 {request.district}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(request.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        STATUS_COLORS[request.status]
                      }`}
                    >
                      {request.status}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setResponse(request.response || "");
                        setStatus(request.status === "Pending" ? "In Progress" : request.status);
                      }}
                      className="text-xs text-purple-600 hover:underline"
                    >
                      {request.response ? "Update Response" : "Respond"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Response Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">
                  {CATEGORY_EMOJIS[selectedRequest.category]}{" "}
                  {selectedRequest.category}
                </h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>

              <p className="text-xs text-gray-400 font-mono mb-3">
                {selectedRequest.anonymousId}
              </p>

              <form onSubmit={handleRespond} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Response
                  </label>
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    required
                    rows={4}
                    placeholder="Write a helpful, supportive response..."
                    className="w-full border rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Update Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={responding}
                    className="flex-1 bg-purple-600 text-white py-2.5 rounded text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    {responding ? "Sending..." : "Send Response"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    className="flex-1 border text-gray-600 py-2.5 rounded text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HelplinePanel;