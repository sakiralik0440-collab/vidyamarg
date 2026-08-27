import { Link, useLocation } from "react-router-dom";

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
  admin: {
    themeColor: "from-rose-600 to-red-700",
    activeClass: "bg-rose-600/20 text-rose-400 border-l-4 border-rose-500 font-semibold",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    portalName: "Admin Panel",
    baseRoute: "/admin",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "🛡️" },
      { id: "users", label: "User Management", icon: "👥" },
      { id: "roles", label: "Role Management (RBAC)", icon: "🔐" },
      { id: "colleges", label: "College Verification", icon: "🏫" },
      { id: "companies", label: "Company Verification", icon: "🏢" },
      { id: "schemes", label: "Manage Schemes", icon: "🏛️" },
      { id: "scholarships", label: "Manage Scholarships", icon: "💰" },
      { id: "logs", label: "System Logs & Audit", icon: "📋" },
      { id: "reports", label: "Reports & Analytics", icon: "📊" },
      { id: "security", label: "Backup & Security", icon: "🔒" },
      { id: "support", label: "Support & Help", icon: "🆘" },
    ],
  },
};

function Sidebar({ currentPortal = "student", activeSection, onSelectSection, isOpen, onClose }) {
  const menuConfig = SIDEBAR_MENUS[currentPortal] || SIDEBAR_MENUS.student;

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
        className={`fixed top-16 bottom-0 left-0 w-72 bg-slate-900 border-r border-slate-800 z-40 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Portal Header */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
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
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
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

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>VidyaMarg v2.0 • Online</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
