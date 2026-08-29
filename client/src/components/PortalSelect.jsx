import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./common/AuthModal";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./common/ThemeToggle";

const PORTAL_CARDS = [
  {
    id: "student",
    title: "1. STUDENT PORTAL",
    shortName: "Student",
    buttonLabel: "Open Student Portal",
    subtitle: "For Enrolled Students & Learners",
    icon: "🎓",
    theme: "blue",
    gradient: "from-blue-600 to-indigo-700",
    border: "border-blue-500/30",
    glow: "shadow-blue-500/10",
    route: "/student/dashboard",
    highlights: [
      "Academic Progress & CGPA Tracker",
      "Career Readiness Score (0-100)",
      "1-Click Job & Drive Applications",
      "Verified Certificates & Badges",
      "Interview Video Calls & Alerts",
    ],
  },
  {
    id: "parent",
    title: "2. PARENT PORTAL",
    shortName: "Parent",
    buttonLabel: "Open Parent Portal",
    subtitle: "For Guardians & Families",
    icon: "👨‍👩‍👦",
    theme: "purple",
    gradient: "from-purple-600 to-fuchsia-700",
    border: "border-purple-500/30",
    glow: "shadow-purple-500/10",
    route: "/parent/dashboard",
    highlights: [
      "Live Child Academic Overview",
      "Attendance Health & Warning Alerts",
      "Exam Marks & Performance Trends",
      "College Fee Status & Payment",
      "Direct Faculty Communication",
    ],
  },
  {
    id: "college",
    title: "3. COLLEGE PORTAL",
    shortName: "College",
    buttonLabel: "Open College Portal",
    subtitle: "For University, Faculty & TPO Cells",
    icon: "🏫",
    theme: "emerald",
    gradient: "from-emerald-600 to-teal-700",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/10",
    route: "/college/dashboard",
    highlights: [
      "Course & Batch Roster Directory",
      "Batch Attendance & Marks Entry",
      "Automated At-Risk Dropout Detector",
      "Campus Placement & Drive Manager",
      "Achievement & Proof Approval",
    ],
  },
  {
    id: "company",
    title: "4. COMPANY PORTAL",
    shortName: "Company",
    buttonLabel: "Open Company Portal",
    subtitle: "For Corporate Recruiters & HR",
    icon: "🏢",
    theme: "orange",
    gradient: "from-orange-600 to-amber-700",
    border: "border-orange-500/30",
    glow: "shadow-orange-500/10",
    route: "/company/dashboard",
    highlights: [
      "Post Jobs & On-Campus Drives",
      "Talent Pool Search by Skills & CGPA",
      "Kanban Applicant Tracking (ATS)",
      "Schedule Multi-Round Interviews",
      "Instant Offer Letter Management",
    ],
  },
];

const CORE_PRINCIPLES = [
  { icon: "🛡️", label: "Role Based Access" },
  { icon: "🔒", label: "Data Privacy" },
  { icon: "🧩", label: "User Data Isolation" },
  { icon: "⚡", label: "Real-time Updates" },
  { icon: "👁️", label: "Transparency" },
  { icon: "🔐", label: "Security First" },
];

function PortalSelect() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedAuthRole, setSelectedAuthRole] = useState("student");

  const handleOpenPortal = (route) => {
    navigate(route);
  };

  const handleSignInRole = (roleId) => {
    setSelectedAuthRole(roleId);
    setAuthModalOpen(true);
  };

  return (
    <div className={`min-h-screen selection:bg-indigo-500 selection:text-white transition-colors duration-300 ${
      isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      {/* Background Decorative Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none" />

      {/* Top Bar */}
      <header className={`relative z-10 border-b backdrop-blur-md px-4 sm:px-6 py-3.5 transition-colors duration-300 ${
        isDark ? "border-slate-800/80 bg-slate-950/60" : "border-slate-200 bg-white/80 shadow-sm"
      }`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-xl shadow-lg shadow-indigo-600/20">
              🎓
            </div>
            <div>
              <span className={`text-lg font-black tracking-tight bg-gradient-to-r bg-clip-text text-transparent ${
                isDark ? "from-white via-slate-200 to-indigo-300" : "from-slate-900 via-slate-700 to-indigo-700"
              }`}>
                VIDYAMARG
              </span>
              <p className={`text-[10px] font-medium ${ isDark ? "text-slate-400" : "text-slate-500" }`}>Unified Education & Career Ecosystem</p>
            </div>
          </div>

          {/* Quick Header Portal Buttons */}
          <div className="hidden xl:flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">Open Portals:</span>
            {PORTAL_CARDS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleOpenPortal(p.route)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
              >
                <span>{p.icon}</span>
                <span>{p.shortName}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2.5">
                <span className={`text-xs hidden sm:inline ${ isDark ? "text-slate-300" : "text-slate-600" }`}>
                  Signed in as <strong className={`font-semibold ${ isDark ? "text-white" : "text-slate-900" }`}>{user.name}</strong> ({user.role})
                </span>
                <button
                  onClick={() => handleOpenPortal(`/${user.role}/dashboard`)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
                >
                  <span>Open {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Portal</span>
                  <span>→</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleSignInRole("student")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/20"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <span>✨</span> Next-Gen Educational & Placement Infrastructure
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            VIDYAMARG
          </h1>
          <p className="text-base sm:text-lg text-slate-400 mt-3 font-medium">
            Select and open the dedicated portal for <span className="text-blue-400 font-bold">Students</span>, <span className="text-purple-400 font-bold">Parents</span>, <span className="text-emerald-400 font-bold">Colleges</span>, <span className="text-orange-400 font-bold">Companies</span> & <span className="text-rose-400 font-bold">Administrators</span>
          </p>

          {/* Quick Particular Portals Launch Bar */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
              Quick Portal Launcher:
            </span>
            {PORTAL_CARDS.map((portal) => (
              <button
                key={portal.id}
                onClick={() => handleOpenPortal(portal.route)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900 border ${portal.border} hover:scale-105 active:scale-95 text-xs font-bold text-white transition-all shadow-lg hover:shadow-indigo-500/10`}
              >
                <span className="text-sm">{portal.icon}</span>
                <span>{portal.buttonLabel}</span>
                <span className="text-slate-400">→</span>
              </button>
            ))}
          </div>

          {/* Core Principles Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {CORE_PRINCIPLES.map((cp) => (
              <span
                key={cp.label}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-full text-[11px] font-semibold text-slate-300"
              >
                <span>{cp.icon}</span>
                <span>{cp.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 5 Portals Grid matching Blueprint */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {PORTAL_CARDS.map((portal) => (
            <div
              key={portal.id}
              className={`bg-slate-900/80 border ${portal.border} rounded-3xl p-5 flex flex-col justify-between hover:scale-[1.02] transition-all shadow-xl ${portal.glow}`}
            >
              <div>
                {/* Header */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${portal.gradient} flex items-center justify-center text-2xl shadow-lg mb-4`}>
                  {portal.icon}
                </div>
                <h2 className="text-sm font-black text-white tracking-tight">{portal.title}</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">{portal.subtitle}</p>

                {/* Highlights List */}
                <ul className="mt-4 space-y-2 text-[11px] text-slate-300">
                  {portal.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span className="leading-tight">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons: Open Portal + Sign In */}
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => handleOpenPortal(portal.route)}
                  className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${portal.gradient} hover:opacity-95 text-white font-bold text-xs transition-all shadow-md shadow-slate-950 flex items-center justify-center gap-1.5`}
                >
                  <span>{portal.buttonLabel}</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => handleSignInRole(portal.id)}
                  className="w-full py-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white font-medium text-[11px] transition-all flex items-center justify-center gap-1"
                >
                  <span>🔐</span>
                  <span>Sign In as {portal.shortName}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Key Workflows Banner */}
        <div className="mt-14 p-6 sm:p-8 bg-slate-900/50 border border-slate-800 rounded-3xl">
          <h2 className="text-base font-bold text-white text-center mb-6">
            🔄 End-to-End Key Workflows
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
              <p className="font-bold text-blue-400 mb-1">Student Lifecycle</p>
              <p className="text-slate-400 text-[11px]">
                Registration ➔ Academics ➔ Skills ➔ Readiness Score ➔ Job Apply ➔ Interview ➔ Offer
              </p>
            </div>
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
              <p className="font-bold text-purple-400 mb-1">Parent Connection</p>
              <p className="text-slate-400 text-[11px]">
                Register ➔ Verify Child ➔ Live Attendance & Grades ➔ At-Risk Alerts ➔ Fee Tracking
              </p>
            </div>
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
              <p className="font-bold text-emerald-400 mb-1">College & Faculty</p>
              <p className="text-slate-400 text-[11px]">
                Enrollments ➔ Batch Attendance ➔ Marks ➔ Dropout Detection ➔ Campus Placement
              </p>
            </div>
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
              <p className="font-bold text-orange-400 mb-1">Recruiter ATS Flow</p>
              <p className="text-slate-400 text-[11px]">
                Post Drive ➔ Search Talent ➔ Review Dossiers ➔ Multi-round Interview ➔ Hiring
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Universal Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole={selectedAuthRole}
        onSuccess={(loggedUser) => {
          navigate(`/${loggedUser.role}/dashboard`);
        }}
      />
    </div>
  );
}

export default PortalSelect;