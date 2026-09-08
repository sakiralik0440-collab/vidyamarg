import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";

const PORTAL_CONFIG = {
  student: { title: "Student Portal", icon: "🎓", color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10", activeBg: "bg-blue-600 shadow-blue-500/20" },
  parent: { title: "Parent Portal", icon: "👨‍👩‍👦", color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10", activeBg: "bg-purple-600 shadow-purple-500/20" },
  college: { title: "College Portal", icon: "🏫", color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10", activeBg: "bg-emerald-600 shadow-emerald-500/20" },
  company: { title: "Company Portal", icon: "🏢", color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/10", activeBg: "bg-orange-600 shadow-orange-500/20" },
  admin: { title: "Admin Portal", icon: "⚙️", color: "text-rose-400", border: "border-rose-500/30", bg: "bg-rose-500/10", activeBg: "bg-rose-600 shadow-rose-500/20" },
};

function Navbar({ currentPortal = "student", onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const portal = PORTAL_CONFIG[currentPortal] || PORTAL_CONFIG.student;
  const pageTitle = location.pathname.includes("/jobs")
    ? "Job opportunities"
    : location.pathname.includes("/achievements")
      ? "Achievement wall"
      : location.pathname.includes("/leaderboard")
        ? "Leaderboard"
        : location.pathname.includes("/college")
          ? "College discovery"
          : location.pathname.includes("/scholarship")
            ? "Scholarships"
            : location.pathname.includes("/profile")
              ? "My profile"
              : location.pathname.includes("/notifications")
                ? "Notifications"
                : "Dashboard";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
      isDark
        ? "bg-slate-900/90 border-slate-800"
        : "bg-white/90 border-slate-200 shadow-sm"
    }`}>
      <div className="flex items-center justify-between px-3 sm:px-6 lg:px-8 h-16">
        {/* Left Side: Toggle & Brand */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onToggleSidebar}
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-lg sm:text-xl shadow-lg shadow-indigo-500/20">
              🎓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r bg-clip-text text-transparent ${
                  isDark
                    ? "from-white via-slate-200 to-indigo-200"
                    : "from-slate-900 via-slate-700 to-indigo-700"
                }`}>
                  VIDYAMARG
                </span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${portal.border} ${portal.bg} ${portal.color}`}>
                  {portal.title}
                </span>
              </div>
              <p className={`text-[10px] hidden sm:block ${ isDark ? "text-slate-400" : "text-slate-500" }`}>A Unified Platform For Education & Placement</p>
            </div>
          </Link>
        </div>

        <div className={`hidden md:block absolute left-1/2 -translate-x-1/2 text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
          {pageTitle}
        </div>

        {/* Center/Right Side: Theme and account controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentPortal === "student" && (
            <button
              onClick={() => navigate("/student/notifications")}
              className={`p-2 rounded-xl transition-colors ${isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
              aria-label="Open notifications"
              title="Notifications"
            >
              <span aria-hidden="true">🔔</span>
            </button>
          )}
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* User Profile / Login Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all text-left ${
                  isDark
                    ? "bg-slate-800/80 border-slate-700 hover:border-slate-600"
                    : "bg-slate-100 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs text-white shadow-md">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="hidden sm:block pr-2">
                  <p className={`text-xs font-semibold leading-tight ${ isDark ? "text-white" : "text-slate-900" }`}>{user.name || "User"}</p>
                  <p className={`text-[10px] capitalize ${ isDark ? "text-slate-400" : "text-slate-500" }`}>{user.role || currentPortal}</p>
                </div>
              </button>

              {showProfileMenu && (
                <div className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn border ${
                  isDark
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
                }`}>
                  <div className={`px-3 py-2 border-b mb-1 ${ isDark ? "border-slate-800" : "border-slate-100" }`}>
                    <p className={`text-xs font-semibold truncate ${ isDark ? "text-white" : "text-slate-900" }`}>{user.name}</p>
                    <p className={`text-[10px] truncate ${ isDark ? "text-slate-400" : "text-slate-500" }`}>{user.email}</p>
                  </div>
                  <Link
                    to="/"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors ${
                      isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"
                    }`}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <span>🏠</span>
                    <span>Master Portal Hub</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors font-medium mt-1 border-t ${
                      isDark ? "border-slate-800" : "border-slate-100"
                    }`}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 sm:px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/20"
            >
              Sign In / Select
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

