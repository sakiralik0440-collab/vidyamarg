import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getStudentByIdAPI, sendAlertAPI } from "../api/studentApi";
import { useAuth } from "../context/AuthContext";
import ProgressTracker from "./ProgressTracker";
import AlertCenter from "./AlertCenter";

function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token } = useAuth();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alertSending, setAlertSending] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await getStudentByIdAPI(id);
        setStudent(data.student);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

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

  const getStatusLabel = (status) => {
    switch (status) {
      case "Active": return t("profile.active");
      case "At Risk": return t("profile.atRisk");
      case "Dropout": return t("profile.dropout");
      case "Placed": return t("profile.placed");
      case "Graduated": return t("profile.graduated");
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleSendAlert = async (alertType) => {
    setAlertSending(true);
    setAlertMessage("");
    try {
      await sendAlertAPI(
        {
          studentId: id,
          alertType,
          language: localStorage.getItem("appLanguage") || "en",
          templateArgs: [student.name],
          sendToAll: true,
          useWhatsApp: false,
        },
        token
      );
      setAlertMessage("✅ Alert sent to all family contacts!");
      setTimeout(() => setAlertMessage(""), 4000);
    } catch (err) {
      setAlertMessage("❌ Alert failed: " + err.message);
    } finally {
      setAlertSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <p className="text-gray-500 text-lg">{t("profile.loading")}</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <p className="text-red-600 text-lg">{error || t("profile.notFound")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate("/register")}
          className="text-orange-700 text-sm mb-4 underline"
        >
          ← {t("profile.backToHome")}
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {student.name}
              </h1>
              <p className="text-gray-500 mt-1">
                {student.village}, {student.district}, {student.state}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(student.status)}`}
            >
              {getStatusLabel(student.status)}
            </span>
          </div>

          {/* Activity Score */}
          <div className="mt-4 p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-500">{t("profile.activityScore")}</p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-orange-500 h-3 rounded-full transition-all"
                  style={{ width: `${student.activityScore}%` }}
                />
              </div>
              <span className="text-orange-700 font-bold text-lg">
                {student.activityScore}/100
              </span>
            </div>
          </div>

          {/* Refresh Status Button */}
          <button
            onClick={async () => {
              try {
                await fetch(`http://localhost:5000/api/dropout/run`, {
                  method: "POST",
                });
                const data = await getStudentByIdAPI(id);
                setStudent(data.student);
              } catch (err) {
                console.error("Status refresh failed:", err);
              }
            }}
            className="mt-3 text-xs text-orange-600 underline"
          >
            🔄 Refresh Status
          </button>

          <p className="text-xs text-gray-400 mt-3">
            {t("profile.registeredOn")}: {formatDate(student.createdAt)}
          </p>
        </div>

        {/* Personal Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-lg font-semibold text-orange-700 mb-4">
            {t("profile.personalInfo")}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <InfoRow
              label={t("registration.gender")}
              value={student.gender || "—"}
            />
            <InfoRow
              label={t("registration.dob")}
              value={formatDate(student.dateOfBirth)}
            />
            <InfoRow
              label={t("registration.category")}
              value={student.category}
            />
            <InfoRow
              label={t("registration.state")}
              value={student.state}
            />
          </div>
        </div>

        {/* Academic Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-lg font-semibold text-orange-700 mb-4">
            {t("profile.academicInfo")}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <InfoRow
              label={t("registration.currentClass")}
              value={student.currentClass}
            />
            <InfoRow
              label={t("registration.stream")}
              value={student.stream}
            />
            <InfoRow
              label={t("registration.interestedField")}
              value={student.interestedField || "—"}
            />
          </div>
        </div>

        {/* Family Contacts Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-lg font-semibold text-orange-700 mb-4">
            {t("profile.contactsTitle")}
          </h2>
          {student.familyContacts && student.familyContacts.length > 0 ? (
            <div className="space-y-3">
              {student.familyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border rounded p-3"
                >
                  <div>
                    <p className="font-medium text-gray-800">{contact.name}</p>
                    <p className="text-sm text-gray-500">
                      {contact.relation} · {contact.phoneNumber}
                    </p>
                  </div>
                  {contact.isPrimary && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                      {t("profile.primary")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">{t("profile.noContacts")}</p>
          )}
        </div>


        {/* Alert Center — only visible to logged in teachers */}
        {token && (
          <AlertCenter
            studentId={id}
            studentName={student.name}
          />
        )}

        {/* Progress Tracker Section */}
        <ProgressTracker studentId={id} />

      </div>
    </div>
  );
}

// Small reusable component for label-value pairs
function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-gray-800 font-medium mt-0.5">{value}</p>
    </div>
  );
}

export default StudentProfile;