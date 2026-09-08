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
  { id: "progress", label: "Progress", icon: "📊", color: "bg-green-100 text-green-800" },
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
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="h-56 animate-pulse rounded-3xl bg-white shadow-sm" />
            <div className="h-56 animate-pulse rounded-3xl bg-white shadow-sm" />
          </div>
          <div className="h-64 animate-pulse rounded-3xl bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-xl text-rose-600">!</div>
          <h1 className="mt-4 text-lg font-extrabold text-slate-900">Unable to load profile</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{error || t("profile.notFound")}</p>
          <button onClick={() => navigate("/")} className="mt-6 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-700">Back to home</button>
        </div>
      </div>
    );
  }



  const score = Math.max(0, Math.min(100, Number(student.activityScore) || 0));
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <button onClick={() => navigate("/")} className="self-start text-sm font-bold text-slate-600 transition hover:text-teal-700">← {t("profile.backToHome")}</button>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => navigate("/student/dashboard")} className="rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-teal-800">🎓 Open Student Portal</button>
            <button onClick={() => navigate(`/parent/${id}`)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-purple-300 hover:text-purple-700">👨‍👩‍👦 Parent View</button>
            <button onClick={() => { localStorage.removeItem("studentId"); navigate("/register"); }} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-slate-400 hover:text-slate-900">Switch Student</button>
          </div>
        </div>

        {!isOnline && <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">📵 Offline mode: showing your latest cached profile data.</div>}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-900 px-6 py-8 text-white md:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-teal-600 text-3xl font-extrabold shadow-lg shadow-teal-950/30">{student.name?.charAt(0)?.toUpperCase() || "S"}</div>
                <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-300">Student profile</p><h1 className="mt-1 truncate text-2xl font-extrabold md:text-3xl">{student.name}</h1><p className="mt-2 truncate text-sm text-slate-300">{[student.village, student.district, student.currentClass].filter(Boolean).join(" · ")}</p></div>
              </div>
              <span className={`self-start rounded-full px-3 py-1.5 text-xs font-bold ${getStatusColor(student.status)}`}>{getStatusLabel(student.status)}</span>
            </div>
            <div className="mt-8 max-w-xl"><div className="flex items-center justify-between text-xs font-semibold text-slate-300"><span>Activity score</span><span className="text-white">{score}/100</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700"><div className="h-full rounded-full bg-teal-400 transition-all" style={{ width: `${score}%` }} /></div></div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <InfoSection title="Personal information" fields={[["Gender", student.gender], ["Category", student.category], ["Date of birth", formatDate(student.dateOfBirth)], ["Interested field", student.interestedField]]} />
            <InfoSection title="Academic information" fields={[["Current class", student.currentClass], ["Stream", student.stream], ["Branch", student.branch], ["Semester", student.semester], ["Roll number", student.rollNo]]} />
            <InfoSection title="Location" fields={[["Village", student.village], ["District", student.district], ["State", student.state]]} />
          </div>
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><SectionHeading title="Family contacts" subtitle="Trusted contacts connected to this student record." />{student.familyContacts?.length ? <div className="space-y-3">{student.familyContacts.map((contact, index) => <div key={contact._id || index} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><p className="font-bold text-slate-900">{contact.name}</p><div className="mt-1 flex flex-wrap justify-between gap-2 text-xs text-slate-500"><span>{contact.relation}</span><span className="font-semibold text-slate-700">{contact.phoneNumber}</span></div></div>)}</div> : <EmptyText text="No family contacts have been added." />}</section>
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><SectionHeading title="Connected services" subtitle="Open a feature to continue your journey." /><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{FEATURES.filter((feature) => !feature.teacherOnly || token).map((feature) => <button key={feature.id} onClick={() => navigate(`/profile/${id}/${feature.id}`)} className="group flex min-h-24 flex-col items-start justify-between rounded-2xl border border-slate-200 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"><span className="text-xl">{feature.icon}</span><span className="text-xs font-bold leading-4 text-slate-700 group-hover:text-teal-700">{feature.label}</span>{feature.teacherOnly && <span className="text-[9px] font-bold uppercase text-slate-400">Teacher access</span>}</button>)}</div></section>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoSection({ title, fields }) {
  const visibleFields = fields.filter(([, value]) => value !== undefined && value !== null && value !== "");
  return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><SectionHeading title={title} />{visibleFields.length ? <div className="grid gap-5 sm:grid-cols-2">{visibleFields.map(([label, value]) => <div key={label}><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-slate-800">{value}</p></div>)}</div> : <EmptyText text="No information has been provided." />}</section>;
}

function SectionHeading({ title, subtitle }) {
  return <div className="mb-5"><h2 className="text-base font-extrabold text-slate-900">{title}</h2>{subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}</div>;
}

function EmptyText({ text }) {
  return <p className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">{text}</p>;
}

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN");
}

export default StudentProfile;