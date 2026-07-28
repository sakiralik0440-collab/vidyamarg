import { useState } from "react";
import { useTranslation } from "react-i18next";
import { matchCollegesAPI } from "../api/studentApi";

function CollegeGuidance({ student }) {
  const { t } = useTranslation();

  const [searching, setSearching] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [searched, setSearched] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);

  const [criteria, setCriteria] = useState({
    marksPercentage: "",
    stream: student?.stream || "",
    category: student?.category || "",
    district: student?.district || "",
    state: student?.state || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setSearched(false);
    setSelectedCollege(null);

    try {
      const data = await matchCollegesAPI(criteria);
      setColleges(data.colleges);
      setSearched(true);
    } catch (err) {
      console.error("College search failed:", err.message);
      setColleges([]);
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

    if (daysLeft < 0) return { label: t("college.deadlinePassed"), color: "text-red-600", urgent: true };
    if (daysLeft === 0) return { label: t("college.today"), color: "text-red-600", urgent: true };
    if (daysLeft <= 7) return { label: `⚠️ ${daysLeft} ${t("college.daysLeft")}`, color: "text-orange-600", urgent: true };
    return { label: `${daysLeft} ${t("college.daysLeft")}`, color: "text-green-600", urgent: false };
  };

  const getMatchLabel = (score) => {
    if (score >= 60) return { label: t("college.excellentMatch"), color: "bg-green-100 text-green-700" };
    if (score >= 30) return { label: t("college.goodMatch"), color: "bg-blue-100 text-blue-700" };
    return { label: t("college.fairMatch"), color: "bg-gray-100 text-gray-600" };
  };

  const formatFees = (fees) => {
    if (!fees) return "—";
    return `₹${fees.toLocaleString("en-IN")}`;
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4">

      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-orange-700">
          🎓 {t("college.title")}
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Find colleges that match your marks and stream
        </p>
      </div>

      <div className="p-6">

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-orange-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            {t("college.findColleges")}
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Marks */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("college.yourMarks")} *
              </label>
              <input
                type="number"
                name="marksPercentage"
                value={criteria.marksPercentage}
                onChange={handleChange}
                min="0"
                max="100"
                required
                placeholder="e.g. 72"
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            {/* Stream */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("registration.stream")}
              </label>
              <select
                name="stream"
                value={criteria.stream}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="">{t("registration.selectOption")}</option>
                <option value="Science">{t("registration.science")}</option>
                <option value="Commerce">{t("registration.commerce")}</option>
                <option value="Arts">{t("registration.arts")}</option>
                <option value="Engineering">Engineering</option>
                <option value="ITI/Skill">ITI / Skill</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("college.category")}
              </label>
              <select
                name="category"
                value={criteria.category}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="">{t("registration.selectOption")}</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("college.district")}
              </label>
              <input
                type="text"
                name="district"
                value={criteria.district}
                onChange={handleChange}
                placeholder="e.g. Hoshangabad"
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={searching}
            className="w-full bg-orange-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-orange-700 transition disabled:opacity-50"
          >
            {searching ? t("college.searching") : t("college.search")}
          </button>
        </form>

        {/* Results */}
        {searched && (
          <div>
            {colleges.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">{t("college.noResults")}</p>
                <p className="text-xs text-gray-300 mt-2">
                  Try lowering your marks filter or removing stream/district filters
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Found <span className="font-semibold text-orange-700">{colleges.length}</span> matching colleges
                </p>

                <div className="space-y-4">
                  {colleges.map((college) => {
                    const deadlineInfo = getDeadlineInfo(college.admissionDeadline);
                    const matchInfo = getMatchLabel(college.matchScore);
                    const isSelected = selectedCollege?._id === college._id;

                    return (
                      <div
                        key={college._id}
                        className={`border rounded-lg overflow-hidden transition ${
                          isSelected ? "border-orange-400 shadow-md" : "border-gray-200"
                        }`}
                      >
                        {/* College Header */}
                        <div
                          className="p-4 cursor-pointer hover:bg-orange-50 transition"
                          onClick={() =>
                            setSelectedCollege(isSelected ? null : college)
                          }
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 text-sm">
                                {college.name}
                              </h3>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {college.district}, {college.state}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1 ml-3">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${matchInfo.color}`}>
                                {matchInfo.label}
                              </span>
                              {deadlineInfo && (
                                <span className={`text-xs font-medium ${deadlineInfo.color}`}>
                                  📅 {deadlineInfo.label}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quick Stats */}
                          <div className="flex gap-4 mt-3 text-xs text-gray-500">
                            <span>
                              💰 {formatFees(college.feesPerYear)}/yr
                            </span>
                            <span>
                              📊 Cutoff: {college.minCutoffPercentage || "—"}%
                            </span>
                            <span>
                              🪑 {college.seatsAvailable || "—"} seats
                            </span>
                          </div>

                          {/* Streams */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {college.streamsOffered.map((stream) => (
                              <span
                                key={stream}
                                className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded"
                              >
                                {stream}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isSelected && (
                          <div className="border-t bg-gray-50 p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                              <div>
                                <p className="text-xs text-gray-400 uppercase mb-1">
                                  {t("college.contact")}
                                </p>
                                <p className="text-gray-700">
                                  {college.contactNumber || "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 uppercase mb-1">
                                  {t("college.deadline")}
                                </p>
                                <p className={`font-medium ${deadlineInfo?.color || "text-gray-700"}`}>
                                  {college.admissionDeadline
                                    ? new Date(college.admissionDeadline).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                      })
                                    : "—"}
                                </p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-xs text-gray-400 uppercase mb-1">
                                  {t("college.address")}
                                </p>
                                <p className="text-gray-700">{college.address || "—"}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-xs text-gray-400 uppercase mb-1">
                                  Category Quota
                                </p>
                                <p className="text-gray-700">
                                  {college.categoryQuota.join(", ")}
                                </p>
                              </div>
                            </div>

                            {/* Match Score Bar */}
                            <div className="mb-4">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>{t("college.matchScore")}</span>
                                <span>{college.matchScore}/100</span>
                              </div>
                              <div className="bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-orange-500 h-2 rounded-full"
                                  style={{ width: `${college.matchScore}%` }}
                                />
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                              {college.contactNumber && (
                                <a
                                  href={`tel:${college.contactNumber}`}
                                  className="flex-1 text-center bg-orange-600 text-white py-2 rounded text-sm font-medium hover:bg-orange-700 transition"
                                >
                                  📞 Call College
                                </a>
                              )}
                              <button
                                onClick={() => setSelectedCollege(null)}
                                className="flex-1 text-center border border-gray-300 text-gray-600 py-2 rounded text-sm hover:bg-gray-50 transition"
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CollegeGuidance;