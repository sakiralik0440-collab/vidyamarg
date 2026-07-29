import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import {
  sendAlertAPI,
  sendCustomAlertAPI,
  getAlertHistoryAPI,
} from "../api/studentApi";

const ALERT_TYPES = [
  {
    key: "dropoutRisk",
    label: "⚠️ At-Risk Warning",
    color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    description: "Student hasn't updated record for 6+ months",
  },
  {
    key: "dropoutConfirmed",
    label: "🔴 Dropout Alert",
    color: "bg-red-100 text-red-700 hover:bg-red-200",
    description: "Student confirmed as dropout",
  },
  {
    key: "admissionDeadline",
    label: "📅 Deadline Reminder",
    color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    description: "Remind about upcoming admission deadline",
  },
  {
    key: "resultSuccess",
    label: "🎉 Success/Result",
    color: "bg-green-100 text-green-700 hover:bg-green-200",
    description: "Congratulate on passing exam or achievement",
  },
  {
    key: "jobOpportunity",
    label: "💼 Job Opportunity",
    color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    description: "Notify about interview or job opportunity",
  },
];

function AlertCenter({ studentId, studentName }) {
  const { t } = useTranslation();
  const { token } = useAuth();

  const [activeTab, setActiveTab] = useState("quick");
  const [sending, setSending] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultType, setResultType] = useState("success");
  const [alertHistory, setAlertHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [customForm, setCustomForm] = useState({
    customMessage: "",
    language: localStorage.getItem("appLanguage") || "en",
    sendToAll: true,
    useWhatsApp: false,
  });

  const [quickForm, setQuickForm] = useState({
    alertType: "",
    language: localStorage.getItem("appLanguage") || "en",
    sendToAll: true,
    useWhatsApp: false,
  });

  // Load alert history when tab switches to history
  useEffect(() => {
    if (activeTab === "history") {
      fetchAlertHistory();
    }
  }, [activeTab]);

  const fetchAlertHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await getAlertHistoryAPI(studentId, token);
      setAlertHistory(data.alerts);
    } catch (err) {
      console.error("Failed to load alert history:", err.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  const showResult = (message, type = "success") => {
    setResultMessage(message);
    setResultType(type);
    setTimeout(() => setResultMessage(""), 5000);
  };

  const handleQuickAlert = async (alertType) => {
    if (!alertType) return;
    setSending(true);
    try {
      const result = await sendAlertAPI(
        {
          studentId,
          alertType,
          language: quickForm.language,
          templateArgs: [studentName],
          sendToAll: quickForm.sendToAll,
          useWhatsApp: quickForm.useWhatsApp,
        },
        token
      );
      showResult(
        `✅ Alert sent to ${result.result?.successCount || 1} contact(s)!`,
        "success"
      );
      setQuickForm((prev) => ({ ...prev, alertType: "" }));
    } catch (err) {
      showResult(`❌ Failed: ${err.message}`, "error");
    } finally {
      setSending(false);
    }
  };

  const handleCustomAlert = async (e) => {
    e.preventDefault();
    if (!customForm.customMessage.trim()) return;
    setSending(true);
    try {
      const result = await sendCustomAlertAPI(
        {
          studentId,
          ...customForm,
        },
        token
      );
      showResult(
        `✅ Custom message sent to ${result.result?.successCount || 1} contact(s)!`,
        "success"
      );
      setCustomForm((prev) => ({ ...prev, customMessage: "" }));
    } catch (err) {
      showResult(`❌ Failed: ${err.message}`, "error");
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAlertTypeLabel = (type) => {
    const found = ALERT_TYPES.find((a) => a.key === type);
    return found ? found.label : type;
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4">

      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-green-800">
          📱 Family Alert Center
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Send alerts to {studentName}'s family contacts
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {["quick", "custom", "history"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium capitalize transition ${
              activeTab === tab
                ? "border-b-2 border-green-700 text-green-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "quick" && "Quick Alerts"}
            {tab === "custom" && "Custom Message"}
            {tab === "history" && "Alert History"}
          </button>
        ))}
      </div>

      <div className="p-6">

        {/* Result Message */}
        {resultMessage && (
          <div
            className={`text-sm px-4 py-3 rounded-lg mb-4 ${
              resultType === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {resultMessage}
          </div>
        )}

        {/* Quick Alerts Tab */}
        {activeTab === "quick" && (
          <div>
            {/* Options */}
            <div className="flex gap-4 mb-5 flex-wrap">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={quickForm.sendToAll}
                  onChange={(e) =>
                    setQuickForm((prev) => ({ ...prev, sendToAll: e.target.checked }))
                  }
                />
                Send to all contacts
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={quickForm.useWhatsApp}
                  onChange={(e) =>
                    setQuickForm((prev) => ({ ...prev, useWhatsApp: e.target.checked }))
                  }
                />
                Send via WhatsApp
              </label>
              <select
                value={quickForm.language}
                onChange={(e) =>
                  setQuickForm((prev) => ({ ...prev, language: e.target.value }))
                }
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

            {/* Alert Type Buttons */}
            <div className="grid grid-cols-1 gap-3">
              {ALERT_TYPES.map((alertType) => (
                <button
                  key={alertType.key}
                  onClick={() => handleQuickAlert(alertType.key)}
                  disabled={sending}
                  className={`text-left px-4 py-3 rounded-lg transition disabled:opacity-50 ${alertType.color}`}
                >
                  <p className="font-medium text-sm">{alertType.label}</p>
                  <p className="text-xs mt-0.5 opacity-75">{alertType.description}</p>
                </button>
              ))}
            </div>

            {sending && (
              <p className="text-sm text-gray-400 mt-4 text-center">
                Sending alert... please wait
              </p>
            )}
          </div>
        )}

        {/* Custom Message Tab */}
        {activeTab === "custom" && (
          <form onSubmit={handleCustomAlert}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                value={customForm.customMessage}
                onChange={(e) =>
                  setCustomForm((prev) => ({
                    ...prev,
                    customMessage: e.target.value,
                  }))
                }
                placeholder="Type your message here... It will be sent as: [VidyaMarg] Message about {student name}: {your message}"
                rows={4}
                required
                className="w-full border rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <p className="text-xs text-gray-400 mt-1">
                {customForm.customMessage.length}/500 characters
              </p>
            </div>

            {/* Options */}
            <div className="flex gap-4 mb-5 flex-wrap">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={customForm.sendToAll}
                  onChange={(e) =>
                    setCustomForm((prev) => ({
                      ...prev,
                      sendToAll: e.target.checked,
                    }))
                  }
                />
                Send to all contacts
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={customForm.useWhatsApp}
                  onChange={(e) =>
                    setCustomForm((prev) => ({
                      ...prev,
                      useWhatsApp: e.target.checked,
                    }))
                  }
                />
                Send via WhatsApp
              </label>
              <select
                value={customForm.language}
                onChange={(e) =>
                  setCustomForm((prev) => ({
                    ...prev,
                    language: e.target.value,
                  }))
                }
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={sending || !customForm.customMessage.trim()}
              className="w-full bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-800 transition disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Custom Message"}
            </button>
          </form>
        )}

        {/* Alert History Tab */}
        {activeTab === "history" && (
          <div>
            {historyLoading ? (
              <p className="text-gray-400 text-sm text-center py-6">
                Loading history...
              </p>
            ) : alertHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">No alerts sent yet</p>
                <p className="text-gray-300 text-xs mt-1">
                  Alerts you send will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {alertHistory.map((alert, index) => (
                  <div
                    key={alert._id || index}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {getAlertTypeLabel(alert.alertType)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            alert.channel === "whatsapp"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {alert.channel === "whatsapp" ? "WhatsApp" : "SMS"}
                        </span>
                        {alert.isAutomatic && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            Auto
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                      {alert.message}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>
                        Sent to {alert.recipientCount} contact(s)
                      </span>
                      <span>{formatDate(alert.createdAt)}</span>
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

export default AlertCenter;