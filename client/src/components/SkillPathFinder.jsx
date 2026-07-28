import { useState } from "react";
import { useTranslation } from "react-i18next";
import { matchSkillCoursesAPI } from "../api/studentApi";

const TYPE_COLORS = {
  ITI: "bg-blue-100 text-blue-700",
  PMKVY: "bg-green-100 text-green-700",
  Diploma: "bg-purple-100 text-purple-700",
  Certificate: "bg-orange-100 text-orange-700",
  Apprenticeship: "bg-yellow-100 text-yellow-700",
  Online: "bg-gray-100 text-gray-700",
};

function SkillPathFinder({ student }) {
  const { t } = useTranslation();

  const [courses, setCourses] = useState([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const [form, setForm] = useState({
    education: "10th Pass",
    age: "",
    gender: student?.gender || "Male",
    district: student?.district || "",
    state: student?.state || "Madhya Pradesh",
    trade: "",
    preferFree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setSearched(false);
    try {
      const data = await matchSkillCoursesAPI({
        ...form,
        age: Number(form.age) || 18,
      });
      setCourses(data.courses);
      setSearched(true);
    } catch (err) {
      console.error("Skill search failed:", err.message);
      setSearched(true);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4">

      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-indigo-700">
          🔧 {t("skills.title")}
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">
          {t("skills.subtitle")}
        </p>
      </div>

      <div className="p-6">

        {/* Info Banner */}
        <div className="bg-indigo-50 rounded-lg p-3 mb-5 text-sm text-indigo-700">
          💡 Not interested in regular college? These skill courses get you
          <strong> job-ready in 1-24 months</strong> — many are completely FREE.
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="bg-gray-50 rounded-lg p-4 mb-6 border"
        >
          <div className="grid grid-cols-2 gap-3 mb-3">

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("skills.education")}
              </label>
              <select
                name="education"
                value={form.education}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="5th Pass">5th Pass</option>
                <option value="8th Pass">8th Pass</option>
                <option value="10th Pass">10th Pass</option>
                <option value="12th Pass">12th Pass</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("skills.age")}
              </label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                min="14"
                max="50"
                placeholder="e.g. 17"
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
                {t("skills.tradeInterest")}
              </label>
              <input
                type="text"
                name="trade"
                value={form.trade}
                onChange={handleChange}
                placeholder="e.g. Electrician, Computer"
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <input
              type="checkbox"
              name="preferFree"
              checked={form.preferFree}
              onChange={handleChange}
            />
            {t("skills.preferFree")}
          </label>

          <button
            type="submit"
            disabled={searching}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {searching ? t("skills.searching") : t("skills.findButton")}
          </button>
        </form>

        {/* Results */}
        {searched && (
          <div>
            {courses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">🔧</p>
                <p className="text-gray-400">{t("skills.noResults")}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  <span className="font-semibold text-indigo-700">
                    {courses.length}
                  </span>{" "}
                  {t("skills.results")}
                </p>

                <div className="space-y-4">
                  {courses.map((course) => {
                    const isExpanded = expandedId === course._id;
                    const typeColor =
                      TYPE_COLORS[course.type] || "bg-gray-100 text-gray-600";

                    return (
                      <div
                        key={course._id}
                        className={`border rounded-lg overflow-hidden transition ${
                          isExpanded
                            ? "border-indigo-400 shadow-md"
                            : "border-gray-200"
                        }`}
                      >
                        {/* Card Header */}
                        <div
                          className="p-4 cursor-pointer hover:bg-indigo-50 transition"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : course._id)
                          }
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 pr-3">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-gray-800 text-sm">
                                  {course.name}
                                </p>
                                {course.isGovernmentFunded && (
                                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                    🏛️ {t("skills.govtFunded")}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                {course.provider}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                📍 {course.district}, {course.state}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor}`}
                              >
                                {course.type}
                              </span>
                              <span
                                className={`text-sm font-bold ${
                                  course.fees === 0
                                    ? "text-green-600"
                                    : "text-gray-700"
                                }`}
                              >
                                {course.fees === 0
                                  ? `🆓 ${t("skills.free")}`
                                  : `₹${course.fees.toLocaleString("en-IN")}`}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-4 mt-2 text-xs text-gray-400">
                            <span>⏱️ {course.duration}</span>
                            <span>🔧 {course.trade}</span>
                            {course.avgSalary && (
                              <span>💰 {course.avgSalary}</span>
                            )}
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="border-t bg-gray-50 p-4 space-y-4">

                            <p className="text-sm text-gray-600">
                              {course.description}
                            </p>

                            {/* Job Roles */}
                            {course.jobRoles?.length > 0 && (
                              <div>
                                <p className="text-xs text-gray-400 uppercase mb-2">
                                  {t("skills.jobRoles")}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {course.jobRoles.map((role, i) => (
                                    <span
                                      key={i}
                                      className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded"
                                    >
                                      {role}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-xs text-gray-400 uppercase mb-1">
                                  {t("skills.duration")}
                                </p>
                                <p className="font-medium">{course.duration}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 uppercase mb-1">
                                  {t("skills.fees")}
                                </p>
                                <p
                                  className={`font-medium ${
                                    course.fees === 0
                                      ? "text-green-600"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {course.feesDescription ||
                                    (course.fees === 0
                                      ? "FREE"
                                      : `₹${course.fees.toLocaleString("en-IN")}`)}
                                </p>
                              </div>
                              {course.avgSalary && (
                                <div className="col-span-2">
                                  <p className="text-xs text-gray-400 uppercase mb-1">
                                    {t("skills.avgSalary")}
                                  </p>
                                  <p className="font-medium text-green-700">
                                    {course.avgSalary}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Contact & Apply */}
                            <div className="flex gap-3">
                              {course.contactNumber && (
                                <a
                                  href={`tel:${course.contactNumber}`}
                                  className="flex-1 text-center border border-indigo-300 text-indigo-600 py-2 rounded text-sm hover:bg-indigo-50 transition"
                                >
                                  📞 {t("skills.contact")}
                                </a>
                              )}
                              {course.applicationLink && (
                                <a
                                  href={course.applicationLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 text-center bg-indigo-600 text-white py-2 rounded text-sm hover:bg-indigo-700 transition"
                                >
                                  🌐 {t("skills.applyNow")}
                                </a>
                              )}
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

export default SkillPathFinder;