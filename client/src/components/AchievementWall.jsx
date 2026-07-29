import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  addAchievementAPI,
  getStudentAchievementsAPI,
  getAchievementWallAPI,
  likeAchievementAPI,
  deleteAchievementAPI,
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
  National: "bg-green-100 text-green-800",
  International: "bg-purple-100 text-purple-700",
};

const CATEGORIES = [
  "Sports",
  "Arts & Culture",
  "NCC/NSS",
  "Community Service",
  "Academic",
  "Technology",
  "Entrepreneurship",
  "Other",
];

const LEVELS = ["School", "District", "State", "National", "International"];

function AchievementWall({ studentId, studentName }) {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("mine");
  const [myAchievements, setMyAchievements] = useState([]);
  const [wallAchievements, setWallAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [likedIds, setLikedIds] = useState(new Set());
  const [wallFilter, setWallFilter] = useState({ category: "", level: "" });

  const [form, setForm] = useState({
    title: "",
    category: "Sports",
    description: "",
    level: "School",
    position: "",
    date: new Date().toISOString().split("T")[0],
    academicYear: "2023-2024",
  });

  useEffect(() => {
    fetchMyAchievements();
    fetchWall();
  }, [studentId]);

  useEffect(() => {
    fetchWall();
  }, [wallFilter]);

  const fetchMyAchievements = async () => {
    try {
      const data = await getStudentAchievementsAPI(studentId);
      setMyAchievements(data.achievements);
    } catch (err) {
      console.error("Failed to fetch achievements:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWall = async () => {
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(wallFilter).filter(([_, v]) => v !== "")
      );
      const data = await getAchievementWallAPI(activeFilters);
      setWallAchievements(data.achievements);
    } catch (err) {
      console.error("Failed to fetch wall:", err.message);
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
      await addAchievementAPI({ studentId, ...form });
      setMessage("✅ Achievement added! Activity score updated.");
      setShowForm(false);
      setForm({
        title: "",
        category: "Sports",
        description: "",
        level: "School",
        position: "",
        date: new Date().toISOString().split("T")[0],
        academicYear: "2023-2024",
      });
      fetchMyAchievements();
      fetchWall();
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLike = async (achievementId) => {
    if (likedIds.has(achievementId)) return;
    try {
      await likeAchievementAPI(achievementId);
      setLikedIds((prev) => new Set([...prev, achievementId]));
      fetchWall();
    } catch (err) {
      console.error("Like failed:", err.message);
    }
  };

  const handleDelete = async (achievementId) => {
    if (!window.confirm("Delete this achievement?")) return;
    try {
      await deleteAchievementAPI(achievementId);
      setMessage("✅ Achievement deleted");
      fetchMyAchievements();
      fetchWall();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  const handleShareWhatsApp = (achievement) => {
    const text = encodeURIComponent(
      `🏆 *Achievement Unlocked!*\n\n` +
      `*${studentName}* has achieved:\n` +
      `${CATEGORY_EMOJIS[achievement.category]} *${achievement.title}*\n` +
      `📍 Level: ${achievement.level}\n` +
      `${achievement.position ? `🥇 Position: ${achievement.position}\n` : ""}` +
      `${achievement.description ? `\n${achievement.description}\n` : ""}` +
      `\n_Powered by VidyaMarg_`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="bg-white rounded-lg shadow mb-4">

      {/* Header */}
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-yellow-700">
            🏆 {t("achievements.title")}
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {t("achievements.subtitle")}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition"
        >
          + {t("achievements.addAchievement")}
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

        {/* Add Form */}
        {showForm && (
          <form
            onSubmit={handleSave}
            className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200"
          >
            <h3 className="font-medium text-gray-700 mb-3">
              Add New Achievement
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Achievement Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. District Cricket Champion"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {t("achievements.category")} *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_EMOJIS[cat]} {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {t("achievements.level")} *
                </label>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  {LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {t("achievements.position")}
                </label>
                <input
                  type="text"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  placeholder="e.g. 1st Place, Gold Medal"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {t("achievements.date")}
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
                  {t("achievements.description")}
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Tell us more about this achievement..."
                  className="w-full border rounded px-3 py-2 text-sm resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-yellow-500 text-white px-4 py-2 rounded text-sm hover:bg-yellow-600 transition disabled:opacity-50"
              >
                {saving ? t("achievements.saving") : t("achievements.save")}
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

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { key: "mine", label: `🏅 ${t("achievements.myAchievements")} (${myAchievements.length})` },
            { key: "wall", label: `🌟 ${t("achievements.wall")}` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab.key
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-yellow-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* My Achievements Tab */}
        {activeTab === "mine" && (
          <div>
            {loading ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : myAchievements.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-5xl mb-3">🏆</p>
                <p className="text-gray-400">{t("achievements.noAchievements")}</p>
                <p className="text-gray-300 text-xs mt-1">
                  {t("achievements.noAchievementsHint")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myAchievements.map((achievement) => (
                  <div
                    key={achievement._id}
                    className="border rounded-lg p-4 hover:bg-yellow-50 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">
                          {CATEGORY_EMOJIS[achievement.category]}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-800">
                              {achievement.title}
                            </p>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                LEVEL_COLORS[achievement.level]
                              }`}
                            >
                              {achievement.level}
                            </span>
                            {achievement.isVerified && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                {t("achievements.verified")}
                              </span>
                            )}
                          </div>
                          {achievement.position && (
                            <p className="text-sm text-yellow-700 font-medium mt-0.5">
                              🥇 {achievement.position}
                            </p>
                          )}
                          {achievement.description && (
                            <p className="text-sm text-gray-500 mt-1">
                              {achievement.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(achievement.date)} ·{" "}
                            {achievement.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end ml-3">
                        <button
                          onClick={() => handleShareWhatsApp(achievement)}
                          className="text-xs text-green-600 hover:underline whitespace-nowrap"
                        >
                          📱 Share
                        </button>
                        <button
                          onClick={() => handleDelete(achievement._id)}
                          className="text-xs text-red-400 hover:text-red-600"
                        >
                          {t("achievements.delete")}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Community Wall Tab */}
        {activeTab === "wall" && (
          <div>
            {/* Wall Filters */}
            <div className="flex gap-3 mb-4">
              <select
                value={wallFilter.category}
                onChange={(e) =>
                  setWallFilter((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="flex-1 border rounded px-3 py-2 text-sm"
              >
                <option value="">{t("achievements.filterByCategory")}</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_EMOJIS[cat]} {cat}
                  </option>
                ))}
              </select>
              <select
                value={wallFilter.level}
                onChange={(e) =>
                  setWallFilter((prev) => ({
                    ...prev,
                    level: e.target.value,
                  }))
                }
                className="flex-1 border rounded px-3 py-2 text-sm"
              >
                <option value="">{t("achievements.filterByLevel")}</option>
                {LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {wallAchievements.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-5xl mb-3">🌟</p>
                <p className="text-gray-400">No achievements on the wall yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {wallAchievements.map((achievement) => (
                  <div
                    key={achievement._id}
                    className="border rounded-lg p-4 hover:bg-yellow-50 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">
                          {CATEGORY_EMOJIS[achievement.category]}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-800">
                              {achievement.title}
                            </p>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                LEVEL_COLORS[achievement.level]
                              }`}
                            >
                              {achievement.level}
                            </span>
                            {achievement.isVerified && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                {t("achievements.verified")}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-blue-700 font-medium mt-0.5">
                            {achievement.student?.name} ·{" "}
                            {achievement.student?.village}
                          </p>
                          {achievement.position && (
                            <p className="text-sm text-yellow-700 mt-0.5">
                              🥇 {achievement.position}
                            </p>
                          )}
                          {achievement.description && (
                            <p className="text-sm text-gray-500 mt-1">
                              {achievement.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(achievement.date)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleLike(achievement._id)}
                        disabled={likedIds.has(achievement._id)}
                        className={`flex flex-col items-center text-sm px-3 py-2 rounded-lg transition ml-3 ${
                          likedIds.has(achievement._id)
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600 hover:bg-yellow-100"
                        }`}
                      >
                        <span className="text-xl">👏</span>
                        <span className="text-xs mt-0.5">
                          {achievement.likes}
                        </span>
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
  );
}

export default AchievementWall;