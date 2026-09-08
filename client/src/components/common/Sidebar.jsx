import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";

const SIDEBAR_MENUS = {
  student: {
    themeColor: "from-blue-600 to-indigo-700",
    activeClass: "bg-blue-600/20 text-blue-400 border-l-4 border-blue-500 font-semibold",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    portalName: "Student Portal",
    baseRoute: "/student",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "colleges", label: "Find Colleges", icon: "🏫" },
      { id: "scholarships", label: "Scholarships", icon: "💰" },
      { id: "academics", label: "Academic Progress", icon: "📈" },
      { id: "attendance", label: "Attendance Tracker", icon: "📅" },
      { id: "readiness", label: "Career Readiness Score", icon: "⚡" },
      { id: "jobs", label: "Recommended Jobs", icon: "💼" },
      { id: "jobs-page", label: "All Job Opportunities", icon: "🔎", route: "/student/jobs" },
      { id: "achievements-page", label: "Achievement Wall", icon: "🏆", route: "/student/achievements" },
      { id: "leaderboard-page", label: "Leaderboard", icon: "📊", route: "/student/leaderboard" },
      { id: "applications", label: "My Applications", icon: "📑" },
      { id: "profile", label: "My Profile", icon: "👤" },
      { id: "notifications", label: "Notifications", icon: "🔔" },
    ],
  },
  parent: {
    themeColor: "from-purple-600 to-violet-700",
    activeClass: "bg-purple-600/20 text-purple-400 border-l-4 border-purple-500 font-semibold",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    portalName: "Parent Portal",
    baseRoute: "/parent",
    items: [
      { id: "dashboard", label: "Dashboard (Child Overview)", icon: "👨‍👩‍👦" },
      { id: "fees", label: "Fee Status (View)", icon: "💳" },
    ],
  },
  college: {
    themeColor: "from-emerald-600 to-teal-700",
    activeClass: "bg-emerald-600/20 text-emerald-400 border-l-4 border-emerald-500 font-semibold",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    portalName: "College Portal",
    baseRoute: "/college",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "🏫" },
      { id: "students", label: "Student Management", icon: "👥" },
    ],
  },
  company: {
    themeColor: "from-orange-600 to-amber-700",
    activeClass: "bg-orange-600/20 text-orange-400 border-l-4 border-orange-500 font-semibold",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    portalName: "Company Portal",
    baseRoute: "/company",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "🏢" },
    ],
  },
  admin: {
    themeColor: "from-rose-600 to-red-700",
    activeClass: "bg-rose-600/20 text-rose-400 border-l-4 border-rose-500 font-semibold",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    portalName: "Admin Portal",
    baseRoute: "/admin",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "⚙️" },
      { id: "users", label: "User Directory", icon: "👥" },
    ],
  },
};


function Sidebar({ currentPortal = "student", activeSection, onSelectSection, isOpen, onClose }) {
  const menuConfig = SIDEBAR_MENUS[currentPortal] || SIDEBAR_MENUS.student;
  const { isDark } = useTheme();
  const location = useLocation();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`portal-sidebar fixed top-16 bottom-0 left-0 w-72 border-r z-40 flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isDark
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200 shadow-xl"
        }`}
      >
        <button
          onClick={onClose}
          className="portal-sidebar-close lg:hidden absolute right-4 top-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Close navigation menu"
        >
          <span aria-hidden="true">×</span>
        </button>
        {/* Portal Header */}
        <div className={`p-4 border-b ${ isDark ? "border-slate-800" : "border-slate-200" }`}>
          <div className="flex items-center justify-between">
            <div><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Workspace</p><p className="mt-1 text-sm font-bold text-slate-100">{menuConfig.portalName}</p></div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${menuConfig.badgeColor}`}>
              {menuConfig.items.length} Modules
            </span>
          </div>
        </div>

        {/* Scrollable Navigation List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {menuConfig.items.map((item) => {
            const isActive = item.route
              ? location.pathname === item.route
              : activeSection === item.id;
            const itemClassName = `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs transition-all ${
              isActive
                ? menuConfig.activeClass
                : isDark
                  ? "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`;

            return (
              item.route ? (
                <Link
                  key={item.id}
                  to={item.route}
                  onClick={onClose}
                  className={itemClassName}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="truncate flex-1">{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                </Link>
              ) : (
              <button
                key={item.id}
                onClick={() => {
                  onSelectSection(item.id);
                  if (onClose) onClose();
                }}
                className={itemClassName}
              >
                <span className="text-base">{item.icon}</span>
                <span className="truncate flex-1">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </button>
              )
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className={`p-3 border-t ${ isDark ? "border-slate-800 bg-slate-950/40" : "border-slate-200 bg-slate-50" }`}>
          <div className={`flex items-center justify-between text-[11px] ${ isDark ? "text-slate-400" : "text-slate-500" }`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>VidyaMarg v2.0</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link to="/" className="text-indigo-400 hover:underline text-[10px]">
                Hub ➔
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
