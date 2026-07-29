import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  getFeeTrackerAPI,
  addFeeEntryAPI,
  deleteFeeEntryAPI,
} from "../api/studentApi";

const ENTRY_TYPES = [
  { value: "Fee Paid", label: "💸 Fee Paid", color: "text-red-600", isExpense: true },
  { value: "Scholarship Received", label: "🎓 Scholarship Received", color: "text-green-600", isExpense: false },
  { value: "Stipend", label: "💰 Stipend", color: "text-green-600", isExpense: false },
  { value: "Other Income", label: "➕ Other Income", color: "text-green-600", isExpense: false },
  { value: "Other Expense", label: "➖ Other Expense", color: "text-red-600", isExpense: true },
];

function FeeTracker({ studentId }) {
  const { t } = useTranslation();

  const [tracker, setTracker] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [form, setForm] = useState({
    type: "Fee Paid",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    academicYear: "2023-2024",
    institution: "",
    receiptNumber: "",
  });

  useEffect(() => {
    fetchTracker();
  }, [studentId]);

  const fetchTracker = async () => {
    try {
      const data = await getFeeTrackerAPI(studentId);
      setTracker(data.tracker);
      setSummary(data.summary);
    } catch (err) {
      console.error("Failed to fetch tracker:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await addFeeEntryAPI(studentId, {
        ...form,
        amount: Number(form.amount),
      });
      setMessage("✅ " + t("fees.successAdd"));
      setShowForm(false);
      setForm({
        type: "Fee Paid",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        academicYear: "2023-2024",
        institution: "",
        receiptNumber: "",
      });
      fetchTracker();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (entryId) => {
    if (!window.confirm(t("fees.confirmDelete"))) return;
    try {
      await deleteFeeEntryAPI(studentId, entryId);
      setMessage("✅ " + t("fees.successDelete"));
      fetchTracker();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  const formatAmount = (amount) =>
    `₹${Number(amount).toLocaleString("en-IN")}`;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getEntryTypeInfo = (type) =>
    ENTRY_TYPES.find((t) => t.value === type) || ENTRY_TYPES[0];

  const filteredEntries = tracker?.entries?.filter((entry) => {
    if (activeTab === "all") return true;
    if (activeTab === "income")
      return (
        entry.type === "Scholarship Received" ||
        entry.type === "Stipend" ||
        entry.type === "Other Income"
      );
    if (activeTab === "expense")
      return entry.type === "Fee Paid" || entry.type === "Other Expense";
    return true;
  }) || [];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <p className="text-gray-400 text-sm">Loading tracker...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow mb-4">

      {/* Header */}
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-emerald-700">
            💰 {t("fees.title")}
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {t("fees.subtitle")}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm bg-emerald-600 text-white px-3 py-2 rounded hover:bg-emerald-700 transition"
        >
          + {t("fees.addEntry")}
        </button>
      </div>

      <div className="p-6">

        {/* Message */}
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

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-red-50 rounded-lg p-4 text-center border border-red-100">
              <p className="text-xs text-red-500 uppercase mb-1">
                {t("fees.totalPaid")}
              </p>
              <p className="text-xl font-bold text-red-700">
                {formatAmount(summary.totalFeesPaid)}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center border border-green-100">
              <p className="text-xs text-green-500 uppercase mb-1">
                {t("fees.totalReceived")}
              </p>
              <p className="text-xl font-bold text-green-700">
                {formatAmount(summary.totalReceived)}
              </p>
            </div>
            <div
              className={`rounded-lg p-4 text-center border ${
                summary.netBalance >= 0
                  ? "bg-blue-50 border-blue-100"
                  : "bg-green-50 border-green-100"
              }`}
            >
              <p
                className={`text-xs uppercase mb-1 ${
                  summary.netBalance >= 0 ? "text-blue-500" : "text-green-600"
                }`}
              >
                {summary.netBalance >= 0
                  ? t("fees.surplus")
                  : t("fees.deficit")}
              </p>
              <p
                className={`text-xl font-bold ${
                  summary.netBalance >= 0 ? "text-blue-700" : "text-green-800"
                }`}
              >
                {formatAmount(Math.abs(summary.netBalance))}
              </p>
            </div>
          </div>
        )}

        {/* Add Entry Form */}
        {showForm && (
          <form
            onSubmit={handleSave}
            className="bg-emerald-50 rounded-lg p-4 mb-6 border border-emerald-100"
          >
            <h3 className="font-medium text-gray-700 mb-3">
              Add New Entry
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {t("fees.type")} *
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  {ENTRY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {t("fees.amount")} *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="e.g. 8000"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {t("fees.date")}
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {t("fees.description")} *
                </label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  placeholder="e.g. College admission fees, NSP Scholarship"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {t("fees.academicYear")}
                </label>
                <input
                  type="text"
                  name="academicYear"
                  value={form.academicYear}
                  onChange={handleChange}
                  placeholder="e.g. 2023-2024"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {t("fees.institution")}
                </label>
                <input
                  type="text"
                  name="institution"
                  value={form.institution}
                  onChange={handleChange}
                  placeholder="e.g. Govt College Bhopal"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {t("fees.receiptNumber")}
                </label>
                <input
                  type="text"
                  name="receiptNumber"
                  value={form.receiptNumber}
                  onChange={handleChange}
                  placeholder="e.g. RCP-2024-001"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-emerald-600 text-white px-4 py-2 rounded text-sm hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {saving ? t("fees.saving") : t("fees.save")}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border text-gray-500 px-4 py-2 rounded text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { key: "all", label: "All" },
            { key: "income", label: "💚 Income" },
            { key: "expense", label: "❤️ Expenses" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                activeTab === tab.key
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Entries List */}
        {filteredEntries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">💰</p>
            <p className="text-gray-400 text-sm">{t("fees.noEntries")}</p>
            <p className="text-gray-300 text-xs mt-1">
              {t("fees.noEntriesHint")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEntries
              .slice()
              .reverse()
              .map((entry) => {
                const typeInfo = getEntryTypeInfo(entry.type);
                return (
                  <div
                    key={entry._id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${typeInfo.color}`}>
                          {typeInfo.isExpense ? "−" : "+"}{" "}
                          {formatAmount(entry.amount)}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                          {entry.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-0.5">
                        {entry.description}
                      </p>
                      <div className="flex gap-3 text-xs text-gray-400 mt-1">
                        <span>{formatDate(entry.date)}</span>
                        {entry.academicYear && (
                          <span>{entry.academicYear}</span>
                        )}
                        {entry.institution && (
                          <span>{entry.institution}</span>
                        )}
                        {entry.receiptNumber && (
                          <span>Receipt: {entry.receiptNumber}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="text-red-400 text-xs hover:text-red-600 ml-3 px-2 py-1 rounded hover:bg-red-50 transition"
                    >
                      {t("fees.deleteEntry")}
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

export default FeeTracker;