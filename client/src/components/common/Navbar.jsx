import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";

const PORTAL_CONFIG = {
  student: { title: "Student Portal", icon: "🎓", color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10", activeBg: "bg-blue-600 shadow-blue-500/20" },
  parent: { title: "Parent Portal", icon: "👨‍👩‍👦", color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10", activeBg: "bg-purple-600 shadow-purple-500/20" },
  college: { title: "College Portal", icon: "🏫", color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10", activeBg: "bg-emerald-600 shadow-emerald-500/20" },
  company: { title: "Company Portal", icon: "🏢", color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/10", activeBg: "bg-orange-600 shadow-orange-500/20" },
};

const ALL_PORTALS = [
  { id: "student", label: "Student", icon: "🎓", route: "/student/dashboard", color: "hover:bg-blue-600/30 hover:text-blue-300" },
  { id: "parent", label: "Parent", icon: "👨‍👩‍👦", route: "/parent/dashboard", color: "hover:bg-purple-600/30 hover:text-purple-300" },
  { id: "college", label: "College", icon: "🏫", route: "/college/dashboard", color: "hover:bg-emerald-600/30 hover:text-emerald-300" },
  { id: "company", label: "Company", icon: "🏢", route: "/company/dashboard", color: "hover:bg-orange-600/30 hover:text-orange-300" },
];

function Navbar({ currentPortal = "student", onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobilePortals, setShowMobilePortals] = useState(false);

  const portal = PORTAL_CONFIG[currentPortal] || PORTAL_CONFIG.student;

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

        {/* Center/Right Side: Dedicated Open Portals Buttons & Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Particular Portals Show Buttons */}
          <div className={`hidden lg:flex items-center gap-1 p-1 rounded-2xl border text-xs ${
            isDark
              ? "bg-slate-950/70 border-slate-800"
              : "bg-slate-100 border-slate-200"
          }`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}>
              Open Portals:
            </span>
            {ALL_PORTALS.map((p) => {
              const isActive = currentPortal === p.id;
              const cfg = PORTAL_CONFIG[p.id];
              return (
                <Link
                  key={p.id}
                  to={p.route}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                    isActive
                      ? `${cfg.activeBg} text-white shadow-md`
                      : `text-slate-400 ${p.color}`
                  }`}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Mobile Portal Switcher Toggle */}
          <div className="lg:hidden relative">
            <button
              onClick={() => setShowMobilePortals(!showMobilePortals)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-slate-200"
                  : "bg-slate-100 border-slate-200 text-slate-700"
              }`}
            >
              <span>{portal.icon}</span>
              <span className="capitalize">{currentPortal}</span>
              <span>▾</span>
            </button>

            {showMobilePortals && (
              <div className={`absolute right-0 mt-2 w-52 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn border ${
                isDark
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-200"
              }`}>
                <p className={`text-[10px] font-bold uppercase px-3 py-1 mb-1 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}>Open Particular Portals</p>
                {ALL_PORTALS.map((p) => (
                  <Link
                    key={p.id}
                    to={p.route}
                    onClick={() => setShowMobilePortals(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      currentPortal === p.id
                        ? "bg-indigo-600 text-white"
                        : isDark
                          ? "text-slate-300 hover:bg-slate-800"
                          : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span>Open {p.label} Portal</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

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
                  <div className={`my-1 border-t pt-1 ${ isDark ? "border-slate-800/60" : "border-slate-100" }`}>
                    <p className={`text-[9px] uppercase font-bold px-3 py-0.5 ${ isDark ? "text-slate-500" : "text-slate-400" }`}>Switch Portals</p>
                    {ALL_PORTALS.map((p) => (
                      <Link
                        key={p.id}
                        to={p.route}
                        onClick={() => setShowProfileMenu(false)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] transition-colors ${
                          isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{p.icon}</span>
                        <span>Open {p.label} Portal</span>
                      </Link>
                    ))}
                  </div>
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

