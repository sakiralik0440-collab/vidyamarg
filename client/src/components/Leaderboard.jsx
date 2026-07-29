import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getLeaderboardAPI, getDistrictComparisonAPI } from "../api/studentApi";

const MEDAL_COLORS = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

function Leaderboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [leaderboard, setLeaderboard] = useState(null);
  const [stats, setStats] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("toppers");
  const [activeView, setActiveView] = useState("leaderboard");

  const [filters, setFilters] = useState({
    village: "",
    district: "",
  });

  const [searchInput, setSearchInput] = useState({
    village: "",
    district: "",
  });

  useEffect(() => {
    fetchLeaderboard();
  }, [filters]);

  useEffect(() => {
    if (activeView === "district") {
      fetchDistrictComparison();
    }
  }, [activeView]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      const data = await getLeaderboardAPI(activeFilters);
      setLeaderboard(data.leaderboard);
      setStats(data.stats);
    } catch (err) {
      console.error("Leaderboard fetch failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDistrictComparison = async () => {
    try {
      const data = await getDistrictComparisonAPI();
      setDistricts(data.districts);
    } catch (err) {
      console.error("District comparison failed:", err.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...searchInput });
  };

  const tabs = [
    { key: "toppers", label: `🏆 ${t("leaderboard.classToppers")}` },
    { key: "improved", label: `📈 ${t("leaderboard.mostImproved")}` },
    { key: "streak", label: `🔥 ${t("leaderboard.studyStreak")}` },
    { key: "activity", label: `⚡ ${t("leaderboard.topActivity")}` },
    { key: "graduates", label: `🎓 ${t("leaderboard.firstGraduate")}` },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-gray-500">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">

      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-green-800">
              🏆 {t("leaderboard.title")}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {t("leaderboard.subtitle")}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView("leaderboard")}
              className={`text-sm px-3 py-2 rounded transition ${
                activeView === "leaderboard"
                  ? "bg-green-700 text-white"
                  : "bg-green-100 text-green-800"
              }`}
            >
              🏆 Leaderboard
            </button>
            <button
              onClick={() => setActiveView("district")}
              className={`text-sm px-3 py-2 rounded transition ${
                activeView === "district"
                  ? "bg-green-700 text-white"
                  : "bg-green-100 text-green-800"
              }`}
            >
              🗺️ {t("leaderboard.districtComparison")}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {activeView === "leaderboard" && (
          <>
            {/* Stats Overview */}
            {stats && (
              <div className="grid grid-cols-4 gap-4 mb-6">
                <StatCard label={t("leaderboard.totalStudents")} value={stats.totalStudents} color="bg-green-600" />
                <StatCard label="Active" value={stats.activeStudents} color="bg-green-500" />
                <StatCard label="Graduated/Placed" value={stats.graduatedStudents} color="bg-blue-500" />
                <StatCard label="Avg Activity Score" value={stats.avgActivityScore} color="bg-purple-500" />
              </div>
            )}

            {/* Search/Filter */}
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-lg shadow p-4 mb-6 flex gap-3"
            >
              <input
                type="text"
                placeholder={t("leaderboard.filterByVillage")}
                value={searchInput.village}
                onChange={(e) =>
                  setSearchInput((prev) => ({ ...prev, village: e.target.value }))
                }
                className="flex-1 border rounded px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder={t("leaderboard.filterByDistrict")}
                value={searchInput.district}
                onChange={(e) =>
                  setSearchInput((prev) => ({
                    ...prev,
                    district: e.target.value,
                  }))
                }
                className="flex-1 border rounded px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="bg-green-700 text-white px-4 py-2 rounded text-sm hover:bg-green-800 transition"
              >
                {t("leaderboard.search")}
              </button>
              {(filters.village || filters.district) && (
                <button
                  type="button"
                  onClick={() => {
                    setFilters({ village: "", district: "" });
                    setSearchInput({ village: "", district: "" });
                  }}
                  className="text-gray-400 text-sm px-3 py-2 rounded border hover:bg-gray-50"
                >
                  Clear
                </button>
              )}
            </form>

            {/* Category Tabs */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="flex overflow-x-auto border-b">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition ${
                      activeTab === tab.key
                        ? "border-b-2 border-green-700 text-green-700"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">

                {/* Class Toppers */}
                {activeTab === "toppers" && (
                  <div>
                    {!leaderboard?.classToppers?.length ? (
                      <EmptyState message={t("leaderboard.noData")} />
                    ) : (
                      <div className="space-y-3">
                        {leaderboard.classToppers.map((topper, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-2xl">🏆</span>
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {topper.student.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {topper.className} · {topper.academicYear} · {topper.student.village}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-xl font-bold text-green-800">
                                  {topper.marks}%
                                </p>
                                <p className="text-xs text-gray-400">
                                  {t("leaderboard.marks")}
                                </p>
                              </div>
                              <button
                                onClick={() => navigate(`/profile/${topper.student._id}`)}
                                className="text-xs text-green-700 hover:underline"
                              >
                                {t("leaderboard.viewProfile")}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Most Improved */}
                {activeTab === "improved" && (
                  <div>
                    {!leaderboard?.mostImproved?.length ? (
                      <EmptyState message={t("leaderboard.noData")} />
                    ) : (
                      <div className="space-y-3">
                        {leaderboard.mostImproved.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-2xl">{MEDAL_COLORS[index]}</span>
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {item.student.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {item.student.village}, {item.student.district}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-xl font-bold text-blue-700">
                                  +{item.improvement}%
                                </p>
                                <p className="text-xs text-gray-400">
                                  {t("leaderboard.improvement")}
                                </p>
                              </div>
                              <button
                                onClick={() => navigate(`/profile/${item.student._id}`)}
                                className="text-xs text-green-700 hover:underline"
                              >
                                {t("leaderboard.viewProfile")}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Study Streak */}
                {activeTab === "streak" && (
                  <div>
                    {!leaderboard?.studyStreaks?.length ? (
                      <EmptyState message={t("leaderboard.noData")} />
                    ) : (
                      <div className="space-y-3">
                        {leaderboard.studyStreaks.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-2xl">{MEDAL_COLORS[index]}</span>
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {item.student.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {item.student.village}, {item.student.district}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-xl font-bold text-green-700">
                                  {item.streak}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {t("leaderboard.years")}
                                </p>
                              </div>
                              <button
                                onClick={() => navigate(`/profile/${item.student._id}`)}
                                className="text-xs text-green-700 hover:underline"
                              >
                                {t("leaderboard.viewProfile")}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Top Activity Score */}
                {activeTab === "activity" && (
                  <div>
                    {!leaderboard?.topActivityScore?.length ? (
                      <EmptyState message={t("leaderboard.noData")} />
                    ) : (
                      <div className="space-y-3">
                        {leaderboard.topActivityScore.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-2xl">{MEDAL_COLORS[index]}</span>
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {item.student.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {item.student.village}, {item.student.district}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-purple-500 h-2 rounded-full"
                                      style={{ width: `${item.activityScore}%` }}
                                    />
                                  </div>
                                  <p className="text-lg font-bold text-purple-700">
                                    {item.activityScore}
                                  </p>
                                </div>
                                <p className="text-xs text-gray-400 text-right">
                                  {t("leaderboard.score")}
                                </p>
                              </div>
                              <button
                                onClick={() => navigate(`/profile/${item.student._id}`)}
                                className="text-xs text-green-700 hover:underline"
                              >
                                {t("leaderboard.viewProfile")}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* First Graduates */}
                {activeTab === "graduates" && (
                  <div>
                    {!leaderboard?.firstGraduates?.length ? (
                      <EmptyState message="No graduates yet — keep going! 💪" />
                    ) : (
                      <div className="space-y-3">
                        {leaderboard.firstGraduates.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-100"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-2xl">🎓</span>
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {item.student.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {item.student.village}, {item.student.district}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  item.status === "Placed"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {item.status}
                              </span>
                              <button
                                onClick={() => navigate(`/profile/${item.student._id}`)}
                                className="text-xs text-green-700 hover:underline"
                              >
                                {t("leaderboard.viewProfile")}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* District Comparison View */}
        {activeView === "district" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="font-semibold text-gray-800">
                🗺️ {t("leaderboard.districtComparison")}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Districts ranked by average activity score
              </p>
            </div>

            {districts.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                Not enough data for district comparison yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-green-50 text-gray-500 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3 text-left">{t("leaderboard.rank")}</th>
                      <th className="px-6 py-3 text-left">District</th>
                      <th className="px-6 py-3 text-left">{t("leaderboard.totalStudents")}</th>
                      <th className="px-6 py-3 text-left">{t("leaderboard.avgScore")}</th>
                      <th className="px-6 py-3 text-left">{t("leaderboard.graduationRate")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {districts.map((district, index) => (
                      <tr key={district.district} className="hover:bg-green-50">
                        <td className="px-6 py-4 text-lg">
                          {MEDAL_COLORS[index] || `#${index + 1}`}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {district.district}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {district.total}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${district.avgActivityScore}%` }}
                              />
                            </div>
                            <span className="text-green-800 font-medium">
                              {district.avgActivityScore}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-medium ${
                            district.graduationRate >= 50
                              ? "text-green-600"
                              : district.graduationRate >= 25
                              ? "text-green-700"
                              : "text-red-500"
                          }`}>
                            {district.graduationRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable stat card
function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 text-center">
      <div className={`text-2xl font-bold text-white ${color} rounded-lg py-2 mb-2`}>
        {value}
      </div>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

// Empty state component
function EmptyState({ message }) {
  return (
    <div className="text-center py-8">
      <p className="text-4xl mb-3">📊</p>
      <p className="text-gray-400 text-sm">{message}</p>
      <p className="text-gray-300 text-xs mt-1">
        Add more student progress records to see rankings
      </p>
    </div>
  );
}

export default Leaderboard;