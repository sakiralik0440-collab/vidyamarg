import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PORTAL_CONFIG = {
  student: { title: "Student Portal", icon: "🎓", color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
  parent: { title: "Parent Portal", icon: "👨‍👩‍👦", color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10" },
  college: { title: "College Portal", icon: "🏫", color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
  company: { title: "Company Portal", icon: "🏢", color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/10" },
  admin: { title: "Admin Panel", icon: "⚙️", color: "text-rose-400", border: "border-rose-500/30", bg: "bg-rose-500/10" },
};

function Navbar({ currentPortal = "student", onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const portal = PORTAL_CONFIG[currentPortal] || PORTAL_CONFIG.student;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        {/* Left Side: Toggle & Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">
              🎓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
                  VIDYAMARG
                </span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${portal.border} ${portal.bg} ${portal.color}`}>
                  {portal.title}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">A Unified Platform For Education & Placement</p>
            </div>
          </Link>
        </div>

        {/* Right Side: Portal Switcher, Alerts & User Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Portal Switcher */}
          <div className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs">
            <Link
              to="/student/dashboard"
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currentPortal === "student" ? "bg-blue-600 text-white font-semibold shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Student
            </Link>
            <Link
              to="/parent/dashboard"
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currentPortal === "parent" ? "bg-purple-600 text-white font-semibold shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Parent
            </Link>
            <Link
              to="/college/dashboard"
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currentPortal === "college" ? "bg-emerald-600 text-white font-semibold shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              College
            </Link>
            <Link
              to="/company/dashboard"
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currentPortal === "company" ? "bg-orange-600 text-white font-semibold shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Company
            </Link>
            <Link
              to="/admin/dashboard"
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currentPortal === "admin" ? "bg-rose-600 text-white font-semibold shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Admin
            </Link>
          </div>

          {/* User Profile / Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="hidden sm:block pr-2">
                  <p className="text-xs font-semibold text-white leading-tight">{user.name || "User"}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{user.role || currentPortal}</p>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/"
                    className="block px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    🏠 Master Portal Select
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors font-medium mt-1"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/20"
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
