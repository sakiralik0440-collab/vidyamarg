import { useState } from "react";
import { useTranslation } from "react-i18next";
import { matchScholarshipsAPI } from "../api/studentApi";

const TYPE_COLORS = {
  "Central Government": "bg-blue-100 text-blue-700",
  "State Government": "bg-green-100 text-green-700",
  Private: "bg-purple-100 text-purple-700",
  NGO: "bg-green-100 text-green-800",
};

function ScholarshipFinder({ student }) {
  const { t } = useTranslation();

  const [scholarships, setScholarships] = useState([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const [form, setForm] = useState({
    category: student?.category || "",
    marksPercentage: "",
    stream: student?.stream || "",
    currentClass: student?.currentClass || "",
    gender: student?.gender || "Male",
    state: student?.state || "Madhya Pradesh",
    familyIncome: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setSearched(false);
    try {
      const data = await matchScholarshipsAPI({
        ...form,
        marksPercentage: Number(form.marksPercentage) || 0,
        familyIncome: Number(form.familyIncome) || 0,
      });
      setScholarships(data.scholarships);
      setSearched(true);
    } catch (err) {
      console.error("Scholarship search failed:", err.message);
      setSearched(true);
    } finally {
      setSearching(false);
    }
  };

  const getDeadlineInfo = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.ceil(
      (deadlineDate - today) / (1000 * 60 * 60 * 24)
    );
    if (daysLeft < 0)
      return { label: t("scholarship.deadlinePassed"), color: "text-red-500", urgent: true };
    if (daysLeft <= 30)
      return {
        label: `⚠️ ${daysLeft} ${t("scholarship.daysLeft")}`,
        color: "text-green-700",
        urgent: true,
      };
    return {
      label: `${daysLeft} ${t("scholarship.daysLeft")}`,
      color: "text-green-600",
      urgent: false,
    };
  };

  const formatAmount = (amount) => {
    if (!amount) return "—";
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4">

      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-green-700">
          🎓 {t("scholarship.title")}
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">
          {t("scholarship.subtitle")}
        </p>
      </div>

      <div className="p-6">

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="bg-green-50 rounded-lg p-4 mb-6 border border-green-100"
        >
          <div className="grid grid-cols-2 gap-3 mb-3">

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="">Select</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Marks (%) *
              </label>
              <input
                type="number"
                name="marksPercentage"
                value={form.marksPercentage}
                onChange={handleChange}
                required
                min="0"
                max="100"
                placeholder="e.g. 72"
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Stream
              </label>
              <select
                name="stream"
                value={form.stream}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="">Select</option>
                <option value="Science">Science</option>
                <option value="Commerce">Commerce</option>
                <option value="Arts">Arts</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Current Class
              </label>
              <input
                type="text"
                name="currentClass"
                value={form.currentClass}
                onChange={handleChange}
                placeholder="e.g. 12th, B.A. 1st Year"
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("scholarship.familyIncome")}
              </label>
              <input
                type="number"
                name="familyIncome"
                value={form.familyIncome}
                onChange={handleChange}
                placeholder={t("scholarship.incomePlaceholder")}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={searching}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
          >
            {searching
              ? t("scholarship.searching")
              : t("scholarship.findButton")}
          </button>
        </form>

        {/* Results */}
        {searched && (
          <div>
            {scholarships.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">🎓</p>
                <p className="text-gray-400">{t("scholarship.noResults")}</p>
                <p className="text-gray-300 text-xs mt-2">
                  {t("scholarship.noResultsHint")}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  <span className="font-semibold text-green-700">
                    {scholarships.length}
                  </span>{" "}
                  {t("scholarship.results")}
                </p>

                <div className="space-y-4">
                  {scholarships.map((scholarship) => {
                    const deadlineInfo = getDeadlineInfo(
                      scholarship.deadline
                    );
                    const isExpanded = expandedId === scholarship._id;
                    const typeColor =
                      TYPE_COLORS[scholarship.type] ||
                      "bg-gray-100 text-gray-600";

                    return (
                      <div
                        key={scholarship._id}
                        className={`border rounded-lg overflow-hidden transition ${
                          isExpanded
                            ? "border-green-400 shadow-md"
                            : "border-gray-200"
                        } ${scholarship.isDeadlinePassed ? "opacity-70" : ""}`}
                      >
                        {/* Card Header */}
                        <div
                          className="p-4 cursor-pointer hover:bg-green-50 transition"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : scholarship._id)
                          }
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 pr-3">
                              <p className="font-semibold text-gray-800 text-sm">
                                {scholarship.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {scholarship.provider}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor}`}
                              >
                                {scholarship.type}
                              </span>
                              {scholarship.amount && (
                                <span className="text-sm font-bold text-green-700">
                                  {formatAmount(scholarship.amount)}
                                  <span className="text-xs font-normal text-gray-400">
                                    /{t("scholarship.perYear")}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quick info row */}
                          <div className="flex justify-between items-center mt-3">
                            {deadlineInfo && (
                              <span
                                className={`text-xs font-medium ${deadlineInfo.color}`}
                              >
                                📅 {deadlineInfo.label}
                              </span>
                            )}
                            <div className="flex items-center gap-2 ml-auto">
                              <div className="w-12 bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-green-500 h-1.5 rounded-full"
                                  style={{
                                    width: `${scholarship.matchScore}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs text-green-700 font-medium">
                                {scholarship.matchScore}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="border-t bg-gray-50 p-4 space-y-4">

                            {/* Description */}
                            <p className="text-sm text-gray-600">
                              {scholarship.description}
                            </p>

                            {/* Why you qualify */}
                            {scholarship.reasons?.length > 0 && (
                              <div className="bg-green-50 rounded p-3">
                                <p className="text-xs font-semibold text-green-700 mb-2">
                                  {t("scholarship.whyQualify")}:
                                </p>
                                <ul className="space-y-1">
                                  {scholarship.reasons.map((reason, i) => (
                                    <li
                                      key={i}
                                      className="text-xs text-green-700"
                                    >
                                      {reason}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Amount description */}
                            {scholarship.amountDescription && (
                              <div>
                                <p className="text-xs text-gray-400 uppercase mb-1">
                                  {t("scholarship.amount")}
                                </p>
                                <p className="text-sm font-medium text-green-700">
                                  {scholarship.amountDescription}
                                </p>
                              </div>
                            )}

                            {/* Documents Required */}
                            {scholarship.documentsRequired?.length > 0 && (
                              <div>
                                <p className="text-xs text-gray-400 uppercase mb-2">
                                  {t("scholarship.documents")}
                                </p>
                                <ul className="space-y-1">
                                  {scholarship.documentsRequired.map(
                                    (doc, i) => (
                                      <li
                                        key={i}
                                        className="text-xs text-gray-600 flex items-center gap-2"
                                      >
                                        <span className="text-green-500">
                                          📄
                                        </span>
                                        {doc}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}

                            {/* Apply Button */}
                            {scholarship.applicationLink &&
                              !scholarship.isDeadlinePassed && (
                                <a
                                  href={scholarship.applicationLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block w-full text-center bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                                >
                                  🌐 {t("scholarship.applyNow")}
                                </a>
                              )}

                            {scholarship.isDeadlinePassed && (
                              <div className="bg-red-50 rounded p-3 text-center">
                                <p className="text-red-600 text-sm font-medium">
                                  ⏰ {t("scholarship.deadlinePassed")}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Prepare documents for next cycle
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ScholarshipFinder;