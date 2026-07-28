import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  getAchievementWallAPI,
  likeAchievementAPI,
} from "../api/studentApi";

const CATEGORY_EMOJIS = {
  Sports: "🏆",
  "Arts & Culture": "🎨",
  "NCC/NSS": "🎖️",
  "Community Service": "🤝",
  Academic: "📚",
  Technology: "💻",
  Entrepreneurship: "💡",
  Other: "⭐",
};

const LEVEL_COLORS = {
  School: "bg-gray-100 text-gray-700",
  District: "bg-blue-100 text-blue-700",
  State: "bg-green-100 text-green-700",
  National: "bg-orange-100 text-orange-700",
  International: "bg-purple-100 text-purple-700",
};

function AchievementWallPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState(new Set());
  const [filter, setFilter] = useState({ category: "", level: "" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchWall();
  }, [filter]);

  const fetchWall = async () => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filter).filter(([_, v]) => v !== "")
      );
      const data = await getAchievementWallAPI(activeFilters);
      setAchievements(data.achievements);
    } catch (err) {
      console.error("Failed to fetch wall:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (achievementId) => {
    if (likedIds.has(achievementId)) return;
    try {
      await likeAchievementAPI(achievementId);
      setLikedIds((prev) => new Set([...prev, achievementId]));
      setAchievements((prev) =>
        prev.map((a) =>
          a._id === achievementId ? { ...a, likes: a.likes + 1 } : a
        )
      );
    } catch (err) {
      console.error("Like failed:", err.message);
    }
  };

  const filtered = achievements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.student?.village?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-yellow-50">

      {/* Header */}
      <div className="bg-yellow-500 text-white px-6 py-5">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">🏆 {t("achievements.title")}</h1>
            <p className="text-sm opacity-80 mt-0.5">
              {t("achievements.subtitle")}
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-yellow-100 hover:text-white underline"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <input
            type="text"
            placeholder="Search by achievement, name, or village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm mb-3"
          />
          <div className="flex gap-3">
            <select
              value={filter.category}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, category: e.target.value }))
              }
              className="flex-1 border rounded px-3 py-2 text-sm"
            >
              <option value="">All Categories</option>
              {Object.entries(CATEGORY_EMOJIS).map(([cat, emoji]) => (
                <option key={cat} value={cat}>
                  {emoji} {cat}
                </option>
              ))}
            </select>
            <select
              value={filter.level}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, level: e.target.value }))
              }
              className="flex-1 border rounded px-3 py-2 text-sm"
            >
              <option value="">All Levels</option>
              {Object.keys(LEVEL_COLORS).map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Achievements Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            Loading achievements...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-5xl mb-3">🌟</p>
            <p className="text-gray-400">No achievements found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((achievement) => (
              <div
                key={achievement._id}
                className="bg-white rounded-lg shadow p-5 hover:shadow-md transition"
              >
                <div className="flex items-start gap-3">
                  <span className="text-4xl">
                    {CATEGORY_EMOJIS[achievement.category]}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold text-gray-800">
                        {achievement.title}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          LEVEL_COLORS[achievement.level]
                        }`}
                      >
                        {achievement.level}
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 font-medium">
                      {achievement.student?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      📍 {achievement.student?.village},{" "}
                      {achievement.student?.district}
                    </p>
                    {achievement.position && (
                      <p className="text-sm text-yellow-700 mt-1">
                        🥇 {achievement.position}
                      </p>
                    )}
                    {achievement.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {achievement.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-gray-400">
                        {formatDate(achievement.date)}
                      </p>
                      <button
                        onClick={() => handleLike(achievement._id)}
                        disabled={likedIds.has(achievement._id)}
                        className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full transition ${
                          likedIds.has(achievement._id)
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600 hover:bg-yellow-100"
                        }`}
                      >
                        <span>👏</span>
                        <span>{achievement.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AchievementWallPage;