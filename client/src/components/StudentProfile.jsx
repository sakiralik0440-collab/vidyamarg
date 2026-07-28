import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useOfflineDetection } from "../hooks/useOfflineDetection";
import { getStudentByIdAPI } from "../api/studentApi";
import { saveToCache, getFromCache } from "../utils/localCache";


// Each feature: id, label, icon, and which component renders it
const FEATURES = [
  { id: "alerts", label: "Family Alerts", icon: "📱", color: "bg-red-100 text-red-700", teacherOnly: true },
  { id: "progress", label: "Progress", icon: "📊", color: "bg-orange-100 text-orange-700" },
  { id: "score", label: "Activity Score", icon: "⚡", color: "bg-purple-100 text-purple-700" },
  { id: "college", label: "Colleges", icon: "🎓", color: "bg-blue-100 text-blue-700" },
  { id: "scholarship", label: "Scholarships", icon: "💰", color: "bg-green-100 text-green-700" },
  { id: "schemes", label: "Govt Schemes", icon: "🏛️", color: "bg-red-100 text-red-700" },
  { id: "skills", label: "Skill Courses", icon: "🔧", color: "bg-indigo-100 text-indigo-700" },
  { id: "mentor", label: "Find Mentor", icon: "🤝", color: "bg-teal-100 text-teal-700" },
  { id: "jobs", label: "Job Opportunities", icon: "💼", color: "bg-blue-100 text-blue-700" },
  { id: "interviews", label: "Interviews", icon: "📞", color: "bg-cyan-100 text-cyan-700" },
  { id: "certificates", label: "Certificates", icon: "🏅", color: "bg-yellow-100 text-yellow-700" },
  { id: "fees", label: "Fee Tracker", icon: "💵", color: "bg-emerald-100 text-emerald-700" },
  { id: "achievements", label: "Achievements", icon: "🏆", color: "bg-amber-100 text-amber-700" },
  { id: "exams", label: "Exam Dates", icon: "📅", color: "bg-violet-100 text-violet-700" },
  { id: "helpline", label: "Need Help?", icon: "🔒", color: "bg-pink-100 text-pink-700" },
];

function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token } = useAuth();
  const { isOnline } = useOfflineDetection();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchStudent = async () => {
      const cachedStudent = getFromCache(`student_${id}`);
      if (cachedStudent && !navigator.onLine) {
        setStudent(cachedStudent);
        setLoading(false);
        return;
      }
      try {
        const data = await getStudentByIdAPI(id);
        setStudent(data.student);
        saveToCache(`student_${id}`, data.student);
      } catch (err) {
        if (cachedStudent) setStudent(cachedStudent);
        else setError(err.message);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
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
    <div className="min-h-screen bg-orange-50 py-6 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Nav Row */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate("/")}
            className="text-orange-700 text-sm underline"
          >
            ← {t("profile.backToHome")}
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/parent/${id}`)}
              className="text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg hover:bg-orange-200 transition"
            >
              👨‍👩‍👦 Parent View
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("studentId");
                navigate("/register");
              }}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Switch Student
            </button>
          </div>
        </div>

        {!isOnline && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4 text-sm text-red-600">
            📵 Offline — showing cached data
          </div>
        )}

        {/* Student Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-5">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-white text-xl font-bold">{student.name}</h1>
                <p className="text-orange-100 text-sm mt-0.5">
                  {student.village}, {student.district} · {student.currentClass}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                {getStatusLabel(student.status)}
              </span>
            </div>
          </div>

          {/* Score bar */}
          <div className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-orange-500 h-2.5 rounded-full transition-all"
                  style={{ width: `${student.activityScore}%` }}
                />
              </div>
              <span className="text-orange-700 font-bold text-sm">
                {student.activityScore}/100
              </span>
            </div>
          </div>
        </div>

        {/* Basic Info — always visible */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <InfoRow label="Category" value={student.category} />
            <InfoRow label="Stream" value={student.stream} />
            <InfoRow label="Gender" value={student.gender || "—"} />
            <InfoRow label="Interested In" value={student.interestedField || "—"} />
          </div>

          {student.familyContacts?.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-400 uppercase mb-2">Family Contacts</p>
              <div className="space-y-2">
                {student.familyContacts.map((c, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {c.name} ({c.relation})
                    </span>
                    <span className="text-gray-800">{c.phoneNumber}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Feature Grid — the main navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3">
            What do you need?
          </p>
          <div className="grid grid-cols-3 gap-3">
            {FEATURES
              .filter((feature) => !feature.teacherOnly || token)
              .map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => navigate(`/profile/${id}/${feature.id}`)}
                  className={`relative flex flex-col items-center justify-center gap-1.5 py-4 rounded-xl transition ${feature.color} hover:opacity-80 hover:scale-[1.03] active:scale-95`}
                >
                  {feature.teacherOnly && (
                    <span className="absolute top-1.5 right-1.5 text-[9px] bg-gray-800 text-white px-1.5 py-0.5 rounded-full">
                      Teacher
                    </span>
                  )}
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="text-xs font-medium text-center leading-tight px-1">
                    {feature.label}
                  </span>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-gray-800 font-medium mt-0.5">{value}</p>
    </div>
  );
}

export default StudentProfile;