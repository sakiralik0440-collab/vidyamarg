import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getStudentExamsAPI } from "../api/studentApi";
import { sendAlertAPI } from "../api/studentApi";
import { useAuth } from "../context/AuthContext";

const TYPE_COLORS = {
  "Board Exam": "bg-red-100 text-red-700",
  "Entrance Exam": "bg-blue-100 text-blue-700",
  "Admission Deadline": "bg-green-100 text-green-800",
  "Scholarship Deadline": "bg-green-100 text-green-700",
  "Government Exam": "bg-purple-100 text-purple-700",
  Other: "bg-gray-100 text-gray-700",
};

const TYPE_EMOJIS = {
  "Board Exam": "📝",
  "Entrance Exam": "🎯",
  "Admission Deadline": "🏫",
  "Scholarship Deadline": "🎓",
  "Government Exam": "🏛️",
  Other: "📅",
};

function ExamTracker({ studentId, student }) {
  const { t } = useTranslation();
  const { token } = useAuth();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [reminderSent, setReminderSent] = useState({});

  useEffect(() => {
    fetchExams();
  }, [studentId]);

  const fetchExams = async () => {
    try {
      const data = await getStudentExamsAPI(studentId);
      setExams(data.exams);
    } catch (err) {
      console.error("Failed to fetch exams:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async (exam) => {
    try {
      await sendAlertAPI(
        {
          studentId,
          alertType: "admissionDeadline",
          language: localStorage.getItem("appLanguage") || "en",
          templateArgs: [
            student?.name || "Student",
            exam.name,
            new Date(exam.examDate).toLocaleDateString("en-IN"),
          ],
          sendToAll: true,
          useWhatsApp: false,
        },
        token
      );
      setReminderSent((prev) => ({ ...prev, [exam._id]: true }));
      setTimeout(
        () =>
          setReminderSent((prev) => ({ ...prev, [exam._id]: false })),
        3000
      );
    } catch (err) {
      console.error("Reminder failed:", err.message);
    }
  };

  const getDaysDisplay = (daysLeft) => {
    if (daysLeft === 0) return { text: t("exams.today"), color: "text-red-600 font-bold" };
    if (daysLeft === 1) return { text: t("exams.tomorrow"), color: "text-red-500 font-bold" };
    if (daysLeft <= 7) return { text: `⚠️ ${daysLeft} ${t("exams.daysLeft")}`, color: "text-green-700 font-semibold" };
    if (daysLeft <= 30) return { text: `${daysLeft} ${t("exams.daysLeft")}`, color: "text-yellow-600" };
    return { text: `${daysLeft} ${t("exams.daysLeft")}`, color: "text-green-600" };
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <p className="text-gray-400 text-sm">Loading exam schedule...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow mb-4">

      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-indigo-700">
          📅 {t("exams.title")}
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">{t("exams.subtitle")}</p>
      </div>

      <div className="p-6">
        {exams.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-gray-400">{t("exams.noExams")}</p>
            <p className="text-gray-300 text-xs mt-1">{t("exams.noExamsHint")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {exams.map((exam) => {
              const daysDisplay = getDaysDisplay(exam.daysLeft);
              const isExpanded = expandedId === exam._id;

              return (
                <div
                  key={exam._id}
                  className={`border rounded-lg overflow-hidden transition ${
                    exam.isUrgent
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  {/* Card Header */}
                  <div
                    className="p-4 cursor-pointer hover:bg-indigo-50 transition"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : exam._id)
                    }
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">
                          {TYPE_EMOJIS[exam.type]}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {exam.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                TYPE_COLORS[exam.type]
                              }`}
                            >
                              {exam.type}
                            </span>
                            {exam.isUrgent && (
                              <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                                {t("exams.urgent")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-3">
                        <p className={`text-sm ${daysDisplay.color}`}>
                          {daysDisplay.text}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDate(exam.examDate)}
                        </p>
                      </div>
                    </div>

                    {/* Registration deadline warning */}
                    {exam.isRegistrationUrgent && exam.regDaysLeft !== null && (
                      <div className="mt-2 bg-green-100 rounded px-3 py-1.5 text-xs text-green-800 font-medium">
                        ⚠️ Registration closes in {exam.regDaysLeft} day(s)!
                      </div>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t bg-gray-50 p-4 space-y-3">
                      {exam.description && (
                        <p className="text-sm text-gray-600">{exam.description}</p>
                      )}

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-gray-400 uppercase mb-1">
                            {t("exams.examDate")}
                          </p>
                          <p className="font-medium text-gray-800">
                            {formatDate(exam.examDate)}
                          </p>
                        </div>
                        {exam.registrationDeadline && (
                          <div>
                            <p className="text-xs text-gray-400 uppercase mb-1">
                              {t("exams.registrationDeadline")}
                            </p>
                            <p
                              className={`font-medium ${
                                exam.isRegistrationUrgent
                                  ? "text-green-700"
                                  : "text-gray-800"
                              }`}
                            >
                              {formatDate(exam.registrationDeadline)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Applicable classes/streams */}
                      {exam.applicableClasses.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-400 uppercase mb-1">
                            For Classes
                          </p>
                          <p className="text-sm text-gray-700">
                            {exam.applicableClasses.join(", ")}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        {exam.applicationLink && (
                          <a
                            href={exam.applicationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center bg-indigo-600 text-white py-2 rounded text-sm font-medium hover:bg-indigo-700 transition"
                          >
                            🌐 {t("exams.applyNow")}
                          </a>
                        )}
                        {token && (
                          <button
                            onClick={() => handleSendReminder(exam)}
                            className={`flex-1 text-center py-2 rounded text-sm font-medium transition ${
                              reminderSent[exam._id]
                                ? "bg-green-100 text-green-700"
                                : "border border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                            }`}
                          >
                            {reminderSent[exam._id]
                              ? t("exams.reminderSent")
                              : `📱 ${t("exams.sendReminder")}`}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamTracker;