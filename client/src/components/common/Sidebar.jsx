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
      { id: "profile", label: "Profile Management", icon: "👤" },
      { id: "academics", label: "Academic Progress", icon: "📈" },
      { id: "attendance", label: "Attendance Tracker", icon: "📅" },
      { id: "exams", label: "Exams & Marks", icon: "📝" },
      { id: "skills", label: "Skills & Certifications", icon: "🎖️" },
      { id: "achievements", label: "Achievements", icon: "🏆" },
      { id: "readiness", label: "Career Readiness Score", icon: "⚡" },
      { id: "jobs", label: "Recommended Jobs", icon: "💼" },
      { id: "scholarships", label: "Scholarships & Schemes", icon: "💰" },
      { id: "mentorship", label: "Mentorship", icon: "🤝" },
      { id: "applications", label: "My Applications", icon: "📑" },
      { id: "interviews", label: "Interview Calls", icon: "📞" },
      { id: "alerts", label: "Notices & Alerts", icon: "🔔" },
      { id: "messages", label: "Messages", icon: "💬" },
      { id: "support", label: "Support / Help", icon: "🆘" },
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
      { id: "child-profile", label: "Child Profile", icon: "👤" },
      { id: "academics", label: "Academic Performance", icon: "📊" },
      { id: "attendance", label: "Attendance Overview", icon: "📅" },
      { id: "exams", label: "Exam Results", icon: "📝" },
      { id: "achievements", label: "Achievements", icon: "🏆" },
      { id: "certificates", label: "Certificates", icon: "📜" },
      { id: "scholarships", label: "Scholarships", icon: "💰" },
      { id: "at-risk", label: "At-Risk Alerts", icon: "⚠️" },
      { id: "notices", label: "Important Notices", icon: "📢" },
      { id: "career", label: "Career Progress", icon: "🚀" },
      { id: "messages", label: "Messages with College", icon: "💬" },
      { id: "fees", label: "Fee Status (View)", icon: "💳" },
      { id: "support", label: "Support / Help", icon: "🆘" },
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
      { id: "courses", label: "Course & Batch Mgmt", icon: "📚" },
      { id: "attendance", label: "Attendance Management", icon: "📅" },
      { id: "marks", label: "Marks & Exams Management", icon: "📝" },
      { id: "reports", label: "Academic Reports", icon: "📊" },
      { id: "at-risk", label: "At-Risk Students", icon: "⚠️" },
      { id: "approvals", label: "Achievements Approval", icon: "✅" },
      { id: "certificates", label: "Certificates Management", icon: "📜" },
      { id: "schemes", label: "Scholarships & Schemes", icon: "💰" },
      { id: "mentors", label: "Mentor Management", icon: "🤝" },
      { id: "placements", label: "Company & Placement Mgmt", icon: "🏢" },
      { id: "drives", label: "Job & Drive Management", icon: "💼" },
      { id: "interviews", label: "Interview Management", icon: "📞" },
      { id: "communication", label: "Communication (Broadcast)", icon: "📢" },
      { id: "noticeboard", label: "Notice Board", icon: "📌" },
      { id: "settings", label: "System Settings", icon: "⚙️" },
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
      { id: "profile", label: "Company Profile", icon: "🏷️" },
      { id: "post-job", label: "Post Job / Drive", icon: "➕" },
      { id: "jobs", label: "Job Management", icon: "💼" },
      { id: "candidates", label: "Search Candidates", icon: "🔍" },
      { id: "shortlist", label: "Candidate Shortlist", icon: "⭐" },
      { id: "applications", label: "Applications Received", icon: "📥" },
      { id: "interviews", label: "Interview Management", icon: "📞" },
      { id: "pipeline", label: "Select / Reject Candidates", icon: "🎯" },
      { id: "offers", label: "Offer Management", icon: "📜" },
      { id: "analytics", label: "Drive Analytics", icon: "📈" },
      { id: "messages", label: "Messages", icon: "💬" },
      { id: "notices", label: "Notices", icon: "📢" },
    ],
  },
};


function Sidebar({ currentPortal = "student", activeSection, onSelectSection, isOpen, onClose }) {
  const menuConfig = SIDEBAR_MENUS[currentPortal] || SIDEBAR_MENUS.student;
  const { isDark } = useTheme();

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
        className={`fixed top-16 bottom-0 left-0 w-72 border-r z-40 flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isDark
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200 shadow-xl"
        }`}
      >
        {/* Portal Header */}
        <div className={`p-4 border-b ${ isDark ? "border-slate-800" : "border-slate-200" }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${ isDark ? "text-slate-400" : "text-slate-500" }`}>
              Navigation Menu
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${menuConfig.badgeColor}`}>
              {menuConfig.items.length} Modules
            </span>
          </div>
        </div>

        {/* Scrollable Navigation List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {menuConfig.items.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectSection(item.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs transition-all ${
                  isActive
                    ? menuConfig.activeClass
                    : isDark
                      ? "text-slate-300 hover:text-white hover:bg-slate-800/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="truncate flex-1">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Portal Switcher in Sidebar */}
        <div className={`p-3 border-t ${ isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-slate-50" }`}>
          <div className="flex items-center justify-between mb-2 px-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${ isDark ? "text-slate-400" : "text-slate-500" }`}>
              Open Other Portals
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            {Object.entries({
              student: { name: "Student", icon: "🎓", route: "/student/dashboard", color: "hover:bg-blue-600/20 hover:text-blue-400" },
              parent: { name: "Parent", icon: "👨‍👩‍👦", route: "/parent/dashboard", color: "hover:bg-purple-600/20 hover:text-purple-400" },
              college: { name: "College", icon: "🏫", route: "/college/dashboard", color: "hover:bg-emerald-600/20 hover:text-emerald-400" },
              company: { name: "Company", icon: "🏢", route: "/company/dashboard", color: "hover:bg-orange-600/20 hover:text-orange-400" },
            })
              .filter(([key]) => key !== currentPortal)
              .map(([key, p]) => (
                <Link
                  key={key}
                  to={p.route}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all ${p.color} ${
                    isDark
                      ? "bg-slate-900 border-slate-800 text-slate-300"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  <span>{p.icon}</span>
                  <span className="truncate">{p.name}</span>
                </Link>
              ))}
          </div>
        </div>

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
