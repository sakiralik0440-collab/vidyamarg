import { useState, useEffect } from "react";
import { getScoreBreakdownAPI } from "../api/studentApi";

const SCORE_COMPONENTS = [
  { key: "streak", label: "Study Streak", icon: "🔥", color: "bg-green-600" },
  { key: "passRate", label: "Pass Rate", icon: "✅", color: "bg-green-500" },
  { key: "marks", label: "Average Marks", icon: "📊", color: "bg-blue-500" },
  { key: "attendance", label: "Attendance", icon: "📅", color: "bg-purple-500" },
  { key: "certificates", label: "Certificates", icon: "🏅", color: "bg-yellow-500" },
  { key: "dropout", label: "Active Status", icon: "💪", color: "bg-teal-500" },
];

function ActivityScoreCard({ studentId }) {
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const data = await getScoreBreakdownAPI(studentId);
        setScoreData(data);
      } catch (err) {
        console.error("Score fetch failed:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, [studentId]);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-green-700";
    if (score >= 40) return "text-yellow-600";
    return "text-red-500";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent 🌟";
    if (score >= 60) return "Good 👍";
    if (score >= 40) return "Average 📈";
    return "Needs Improvement 💪";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <p className="text-gray-400 text-sm">Calculating score...</p>
      </div>
    );
  }

  if (!scoreData) return null;

  const { score, breakdown } = scoreData;

  return (
    <div className="bg-white rounded-lg shadow mb-4">

      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-green-800">
          ⚡ Activity Score
        </h2>
      </div>

      <div className="p-6">

        {/* Big Score Display */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className={`text-5xl font-bold ${getScoreColor(score)}`}>
              {score}
              <span className="text-2xl text-gray-400">/100</span>
            </p>
            <p className={`text-sm font-medium mt-1 ${getScoreColor(score)}`}>
              {getScoreLabel(score)}
            </p>
          </div>

          {/* Circular progress visual */}
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
              <circle
                cx="18" cy="18" r="15.9"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <circle
                cx="18" cy="18" r="15.9"
                fill="none"
                stroke={score >= 80 ? "#16a34a" : score >= 60 ? "#ea580c" : score >= 40 ? "#ca8a04" : "#dc2626"}
                strokeWidth="3"
                strokeDasharray={`${score} ${100 - score}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                {score}%
              </span>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                score >= 80 ? "bg-green-500" :
                score >= 60 ? "bg-green-600" :
                score >= 40 ? "bg-yellow-500" : "bg-red-500"
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Toggle breakdown */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-green-700 underline mb-4"
        >
          {expanded ? "Hide breakdown ▲" : "See how this is calculated ▼"}
        </button>

        {/* Score Breakdown */}
        {expanded && breakdown && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
              Score Breakdown
            </p>
            {SCORE_COMPONENTS.map((component) => {
              const data = breakdown[component.key];
              if (!data) return null;
              const percentage = (data.points / data.max) * 100;

              return (
                <div key={component.key}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span>{component.icon}</span>
                      <span className="text-sm text-gray-700">
                        {component.label}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {data.points}/{data.max} pts
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2 mb-1">
                    <div
                      className={`h-2 rounded-full ${component.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400">{data.detail}</p>
                </div>
              );
            })}

            {/* How to improve */}
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-xs font-semibold text-green-800 mb-2">
                💡 How to improve your score:
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                {breakdown.streak?.points < 20 && (
                  <li>• Add more yearly progress records (+5 pts each)</li>
                )}
                {breakdown.marks?.points < 20 && (
                  <li>• Improve marks above 85% for maximum points</li>
                )}
                {breakdown.attendance?.points < 15 && (
                  <li>• Maintain attendance above 95% for full points</li>
                )}
                {breakdown.certificates?.points < 15 && (
                  <li>• Earn more certificates (+5 pts each)</li>
                )}
                {breakdown.dropout?.points < 10 && (
                  <li>• Stay active and update records regularly</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityScoreCard;