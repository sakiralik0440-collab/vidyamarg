import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getDistrictOverviewAPI,
  getVillageBreakdownAPI,
  getStreamAnalysisAPI,
} from "../api/studentApi";

function DistrictView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [overview, setOverview] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [streams, setStreams] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("districts");

  useEffect(() => {
    fetchOverview();
    fetchStreams();
  }, []);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const data = await getDistrictOverviewAPI(token);
      setOverview(data.stateTotals);
      setDistricts(data.districts);
    } catch (err) {
      console.error("Failed to fetch overview:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStreams = async () => {
    try {
      const data = await getStreamAnalysisAPI(token);
      setStreams(data.streams);
    } catch (err) {
      console.error("Failed to fetch streams:", err.message);
    }
  };

  const handleViewVillages = async (district) => {
    setSelectedDistrict(district);
    try {
      const data = await getVillageBreakdownAPI(district.district, token);
      setVillages(data.villages);
      setActiveTab("villages");
    } catch (err) {
      console.error("Failed to fetch villages:", err.message);
    }
  };

  const getRateColor = (rate) => {
    if (rate >= 30) return "text-red-600";
    if (rate >= 15) return "text-green-700";
    return "text-green-600";
  };

  const getBarColor = (rate) => {
    if (rate >= 30) return "bg-red-500";
    if (rate >= 15) return "bg-green-600";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Loading district data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              🗺️ {t("district.title")}
            </h1>
            <p className="text-sm text-gray-400">{t("district.subtitle")}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/college/dashboard")}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-all"
            >
              🏫 Open College Portal
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-3 py-1.5 rounded-lg transition-all"
            >
              🏠 All Portals Hub
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* State Overview Cards */}
        {overview && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              label={t("district.totalStudents")}
              value={overview.totalStudents}
              color="bg-blue-500"
            />
            <StatCard
              label={t("district.totalDistricts")}
              value={overview.totalDistricts}
              color="bg-purple-500"
            />
            <StatCard
              label="At Risk + Dropout"
              value={overview.totalAtRisk + overview.totalDropout}
              color="bg-red-500"
            />
            <StatCard
              label={t("district.avgScore")}
              value={overview.avgActivityScore}
              color="bg-green-500"
            />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "districts", label: `🗺️ ${t("district.districtBreakdown")}` },
            { key: "streams", label: `📚 ${t("district.streamAnalysis")}` },
            selectedDistrict && {
              key: "villages",
              label: `🏘️ ${selectedDistrict.district} Villages`,
            },
          ]
            .filter(Boolean)
            .map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === tab.key
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
        </div>

        {/* Districts Tab */}
        {activeTab === "districts" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="font-semibold text-gray-800">
                District Performance (sorted by dropout rate)
              </h2>
            </div>
            {districts.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                {t("district.noData")}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3 text-left">District</th>
                      <th className="px-6 py-3 text-left">Villages</th>
                      <th className="px-6 py-3 text-left">Students</th>
                      <th className="px-6 py-3 text-left">Active</th>
                      <th className="px-6 py-3 text-left">At Risk</th>
                      <th className="px-6 py-3 text-left">Dropout Rate</th>
                      <th className="px-6 py-3 text-left">Avg Score</th>
                      <th className="px-6 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {districts.map((district, index) => (
                      <tr
                        key={district.district}
                        className={`hover:bg-gray-50 ${
                          district.dropoutRate >= 30 ? "bg-red-50" : ""
                        }`}
                      >
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {district.district}
                          {district.dropoutRate >= 30 && (
                            <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                              ⚠️ High Risk
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {district.villages}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {district.total}
                        </td>
                        <td className="px-6 py-4 text-green-600">
                          {district.active}
                        </td>
                        <td className="px-6 py-4 text-yellow-600">
                          {district.atRisk}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getBarColor(district.dropoutRate)}`}
                                style={{
                                  width: `${Math.min(district.dropoutRate, 100)}%`,
                                }}
                              />
                            </div>
                            <span
                              className={`font-medium ${getRateColor(district.dropoutRate)}`}
                            >
                              {district.dropoutRate}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{
                                  width: `${district.avgActivityScore}%`,
                                }}
                              />
                            </div>
                            <span className="text-blue-700 font-medium">
                              {district.avgActivityScore}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewVillages(district)}
                            className="text-xs text-blue-600 hover:underline font-medium"
                          >
                            {t("district.viewVillages")} →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Stream Analysis Tab */}
        {activeTab === "streams" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="font-semibold text-gray-800">
                {t("district.streamAnalysis")}
              </h2>
            </div>
            {streams.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                {t("district.noData")}
              </div>
            ) : (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {streams.map((stream) => (
                  <div
                    key={stream.stream}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-semibold text-gray-800">
                        {stream.stream}
                      </p>
                      <span className="text-sm text-gray-500">
                        {stream.total} students
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-600">Active</span>
                        <span className="font-medium">{stream.active}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-600">At Risk</span>
                        <span className="font-medium">{stream.atRisk}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-600">Dropout Rate</span>
                        <span
                          className={`font-medium ${getRateColor(stream.dropoutRate)}`}
                        >
                          {stream.dropoutRate}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">Avg Score</span>
                        <span className="font-medium text-blue-700">
                          {stream.avgScore}/100
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${stream.avgScore}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Villages Tab */}
        {activeTab === "villages" && selectedDistrict && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-gray-800">
                  Villages in {selectedDistrict.district}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {villages.length} villages · {selectedDistrict.total} total students
                </p>
              </div>
              <button
                onClick={() => setActiveTab("districts")}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                {t("district.backToDistricts")}
              </button>
            </div>
            {villages.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                No village data available
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3 text-left">Village</th>
                      <th className="px-6 py-3 text-left">Students</th>
                      <th className="px-6 py-3 text-left">Active</th>
                      <th className="px-6 py-3 text-left">At Risk</th>
                      <th className="px-6 py-3 text-left">Dropout</th>
                      <th className="px-6 py-3 text-left">Dropout Rate</th>
                      <th className="px-6 py-3 text-left">Avg Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {villages.map((village) => (
                      <tr
                        key={village.village}
                        className={`hover:bg-gray-50 ${
                          village.needsAttention ? "bg-yellow-50" : ""
                        }`}
                      >
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {village.village}
                          {village.needsAttention && (
                            <span className="ml-2 text-xs text-yellow-600">
                              ⚠️
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {village.total}
                        </td>
                        <td className="px-6 py-4 text-green-600">
                          {village.active}
                        </td>
                        <td className="px-6 py-4 text-yellow-600">
                          {village.atRisk}
                        </td>
                        <td className="px-6 py-4 text-red-600">
                          {village.dropout}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`font-medium ${getRateColor(village.dropoutRate)}`}
                          >
                            {village.dropoutRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{
                                  width: `${village.avgActivityScore}%`,
                                }}
                              />
                            </div>
                            <span className="text-blue-700">
                              {village.avgActivityScore}
                            </span>
                          </div>
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

export default DistrictView;