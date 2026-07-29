import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { sendAlertAPI } from "../api/studentApi";

function StudentCard({ student, highlight = false }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token } = useAuth();
  const [alertSent, setAlertSent] = useState(false);

  const handleQuickAlert = async (e) => {
    e.stopPropagation();
    try {
      await sendAlertAPI(
        {
          studentId: student._id,
          alertType: student.status === "Dropout" ? "dropoutConfirmed" : "dropoutRisk",
          language: localStorage.getItem("appLanguage") || "en",
          templateArgs: [student.name],
          sendToAll: true,
          useWhatsApp: false,
        },
        token
      );
      setAlertSent(true);
      setTimeout(() => setAlertSent(false), 3000);
    } catch (err) {
      console.error("Quick alert failed:", err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "At Risk": return "bg-yellow-100 text-yellow-800";
      case "Dropout": return "bg-red-100 text-red-800";
      case "Placed": return "bg-blue-100 text-blue-800";
      case "Graduated": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getBorderColor = (status) => {
    if (!highlight) return "border-gray-100";
    switch (status) {
      case "At Risk": return "border-l-4 border-l-yellow-400";
      case "Dropout": return "border-l-4 border-l-red-500";
      default: return "border-gray-100";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <tr
      className={`hover:bg-green-50 transition ${getBorderColor(student.status)}`}
    >
      <td className="px-6 py-4">
        <div className="font-medium text-gray-800">{student.name}</div>
        <div className="text-xs text-gray-400 mt-0.5">
          {student.gender || "—"} · DOB: {formatDate(student.dateOfBirth)}
        </div>
      </td>
      <td className="px-6 py-4 text-gray-500">
        <div>{student.village}</div>
        <div className="text-xs text-gray-400">
          {student.district}, {student.state}
        </div>
      </td>
      <td className="px-6 py-4 text-gray-500">
        <div>{student.currentClass}</div>
        <div className="text-xs text-gray-400">{student.stream}</div>
      </td>
      <td className="px-6 py-4 text-gray-500 text-sm">
        {student.category}
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}
        >
          {student.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${student.activityScore}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">{student.activityScore}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-400 text-xs">
        {formatDate(student.createdAt)}
      </td>

      {/* Action Column — updated with quick alert */}
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <button
            onClick={() => navigate(`/profile/${student._id}`)}
            className="text-green-700 text-xs hover:underline font-medium"
          >
            {t("dashboard.viewProfile")}
          </button>
          {token && (student.status === "At Risk" || student.status === "Dropout") && (
            <button
              onClick={handleQuickAlert}
              className={`text-xs ${
                alertSent
                  ? "text-green-600"
                  : "text-yellow-600 hover:underline"
              }`}
            >
              {alertSent ? "✅ Sent!" : "📱 Alert Family"}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default StudentCard;