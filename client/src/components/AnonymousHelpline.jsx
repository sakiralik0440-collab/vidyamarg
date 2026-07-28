import { useState } from "react";
import { useTranslation } from "react-i18next";
import { submitHelplineAPI, trackHelplineAPI } from "../api/studentApi";

const CATEGORIES = [
  { value: "Bullying", key: "bullying", emoji: "😰" },
  { value: "Financial Problem", key: "financial", emoji: "💸" },
  { value: "Family Pressure", key: "family", emoji: "👨‍👩‍👦" },
  { value: "Mental Health", key: "mental", emoji: "🧠" },
  { value: "Academic Stress", key: "academic", emoji: "📚" },
  { value: "Dropout Risk", key: "dropout", emoji: "⚠️" },
  { value: "Other", key: "other", emoji: "💬" },
];

function AnonymousHelpline({ student }) {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("submit");
  const [submitting, setSubmitting] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [trackedRequest, setTrackedRequest] = useState(null);
  const [trackError, setTrackError] = useState("");
  const [trackId, setTrackId] = useState("");
  const [idCopied, setIdCopied] = useState(false);

  const [form, setForm] = useState({
    category: "Academic Stress",
    message: "",
    isUrgent: false,
    village: student?.village || "",
    district: student?.district || "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await submitHelplineAPI(form);
      setSubmitted(data);
    } catch (err) {
      console.error("Submission failed:", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    setTracking(true);
    setTrackError("");
    setTrackedRequest(null);
    try {
      const data = await trackHelplineAPI(trackId.trim().toUpperCase());
      setTrackedRequest(data.request);
    } catch (err) {
      setTrackError("No request found with this ID. Please check and try again.");
    } finally {
      setTracking(false);
    }
  };

  const handleCopyId = () => {
    if (submitted?.anonymousId) {
      navigator.clipboard.writeText(submitted.anonymousId);
      setIdCopied(true);
      setTimeout(() => setIdCopied(false), 2000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "In Progress": return "bg-blue-100 text-blue-700";
      case "Resolved": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="bg-white rounded-lg shadow mb-4">

      {/* Header */}
      <div className="px-6 py-4 border-b bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-lg">
        <h2 className="text-lg font-semibold text-white">
          🔒 {t("helpline.title")}
        </h2>
        <p className="text-sm text-purple-100 mt-0.5">
          {t("helpline.subtitle")}
        </p>
      </div>

      <div className="p-6">

        {/* Anonymous guarantee */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-5 flex items-center gap-3">
          <span className="text-3xl">🔐</span>
          <div>
            <p className="text-sm font-semibold text-purple-700">
              {t("helpline.anonymous")}
            </p>
            <p className="text-xs text-gray-500">{t("helpline.guarantee")}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { key: "submit", label: "📝 Submit Request" },
            { key: "track", label: "🔍 Track Request" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSubmitted(null);
                setTrackedRequest(null);
                setTrackError("");
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab.key
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-purple-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Submit Tab */}
        {activeTab === "submit" && (
          <div>
            {submitted ? (
              // Success State
              <div className="text-center py-4">
                <p className="text-5xl mb-4">✅</p>
                <p className="text-lg font-semibold text-green-700 mb-2">
                  {t("helpline.successMessage")}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {t("helpline.saveId")}
                </p>

                {/* Anonymous ID display */}
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <p className="font-mono text-xl font-bold text-purple-700 tracking-wider">
                    {submitted.anonymousId}
                  </p>
                  <button
                    onClick={handleCopyId}
                    className="mt-2 text-sm text-purple-600 hover:underline"
                  >
                    {idCopied ? "✅ Copied!" : "📋 Copy ID"}
                  </button>
                </div>

                <p className="text-xs text-gray-400 mb-4">
                  Use this ID in the "Track Request" tab to see if anyone has
                  responded to your request.
                </p>

                <button
                  onClick={() => {
                    setSubmitted(null);
                    setForm({
                      category: "Academic Stress",
                      message: "",
                      isUrgent: false,
                      village: student?.village || "",
                      district: student?.district || "",
                    });
                  }}
                  className="text-sm text-purple-600 underline"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              // Form
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("helpline.category")}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            category: cat.value,
                          }))
                        }
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition text-left ${
                          form.category === cat.value
                            ? "bg-purple-100 border-purple-400 text-purple-700 font-medium"
                            : "border-gray-200 text-gray-600 hover:bg-purple-50"
                        }`}
                      >
                        <span>{cat.emoji}</span>
                        <span>{t(`helpline.${cat.key}`)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("helpline.message")}
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    minLength={10}
                    rows={4}
                    placeholder={t("helpline.messagePlaceholder")}
                    className="w-full border rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {form.message.length} characters
                  </p>
                </div>

                {/* Urgent Checkbox */}
                <label className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isUrgent"
                    checked={form.isUrgent}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-red-700 font-medium">
                    🚨 {t("helpline.isUrgent")}
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={submitting || form.message.trim().length < 10}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {submitting ? t("helpline.submitting") : `🔒 ${t("helpline.submit")}`}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Track Tab */}
        {activeTab === "track" && (
          <div>
            <form onSubmit={handleTrack} className="flex gap-3 mb-4">
              <input
                type="text"
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                placeholder={t("helpline.trackPlaceholder")}
                className="flex-1 border rounded px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                type="submit"
                disabled={tracking || !trackId.trim()}
                className="bg-purple-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50"
              >
                {tracking ? "..." : t("helpline.track")}
              </button>
            </form>

            {trackError && (
              <p className="text-red-500 text-sm mb-4">{trackError}</p>
            )}

            {trackedRequest && (
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-mono text-sm text-gray-500">
                    {trackedRequest.anonymousId}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(trackedRequest.status)}`}
                  >
                    {trackedRequest.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Category</p>
                    <p className="text-gray-700">{trackedRequest.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Submitted</p>
                    <p className="text-gray-700">
                      {formatDate(trackedRequest.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-1">
                      {t("helpline.response")}
                    </p>
                    <div
                      className={`p-3 rounded ${
                        trackedRequest.response
                          ? "bg-green-50 text-green-800"
                          : "bg-gray-50 text-gray-400 italic"
                      }`}
                    >
                      {trackedRequest.response || t("helpline.noResponse")}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnonymousHelpline;