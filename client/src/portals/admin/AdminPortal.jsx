import { useState, useEffect } from "react";
import PortalLayout from "../../components/common/PortalLayout";
import { useAuth } from "../../context/AuthContext";

function AdminPortal() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState("");

  const [pendingColleges, setPendingColleges] = useState([
    { id: "c1", name: "SGSITS Indore", code: "SGS-002", district: "Indore", accreditation: "AICTE / NAAC A++", status: "Pending" },
    { id: "c2", name: "UIT RGPV Bhopal", code: "UIT-001", district: "Bhopal", accreditation: "NAAC A+", status: "Pending" },
  ]);

  const [pendingCompanies, setPendingCompanies] = useState([
    { id: "cmp1", name: "Tata Consultancy Services", cin: "L74140MH1995PLC084781", industry: "IT & Services", status: "Pending" },
    { id: "cmp2", name: "Persistent Systems", cin: "L72300PN1990PLC056696", industry: "Software", status: "Pending" },
  ]);

  const [systemLogs, setSystemLogs] = useState([
    { id: "l1", time: "10 mins ago", action: "Recruiter Login", user: "hr@infosys.com", ip: "103.24.89.12", status: "SUCCESS" },
    { id: "l2", time: "25 mins ago", action: "Batch Attendance Marked", user: "prof.sharma@ietdavv.edu.in", ip: "14.139.240.2", status: "SUCCESS" },
    { id: "l3", time: "1 hour ago", action: "Job Application Submitted", user: "sakir.ali@student.vidyamarg.in", ip: "49.36.112.98", status: "SUCCESS" },
    { id: "l4", time: "3 hours ago", action: "High Risk Dropout Flagged", user: "SYSTEM CRON", ip: "127.0.0.1", status: "WARNING" },
  ]);

  const [users, setUsers] = useState([
    { id: "u1", name: "Sakir Ali", email: "sakir@example.com", role: "student", status: "active" },
    { id: "u2", name: "IET DAVV Indore", email: "admin@ietdavv.edu.in", role: "college", status: "active" },
    { id: "u3", name: "Infosys Campus HR", email: "campus@infosys.com", role: "company", status: "active" },
    { id: "u4", name: "Ramesh Ali (Parent)", email: "parent.ramesh@example.com", role: "parent", status: "active" },
  ]);

  useEffect(() => {
    fetch("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("vm_token")}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (res && res.success) {
          if (res.dashboard.pendingColleges) setPendingColleges(res.dashboard.pendingColleges);
          if (res.dashboard.pendingCompanies) setPendingCompanies(res.dashboard.pendingCompanies);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleVerifyCollege = (id) => {
    setPendingColleges(pendingColleges.filter((c) => c.id !== id));
    setActionSuccess("College accreditation verified successfully!");
    setTimeout(() => setActionSuccess(""), 4000);
  };

  const handleVerifyCompany = (id) => {
    setPendingCompanies(pendingCompanies.filter((c) => c.id !== id));
    setActionSuccess("Corporate recruiter verified successfully!");
    setTimeout(() => setActionSuccess(""), 4000);
  };

  return (
    <PortalLayout
      currentPortal="admin"
      activeSection={activeSection}
      onSelectSection={setActiveSection}
    >
      {actionSuccess && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm flex items-center justify-between animate-fadeIn">
          <span>✅ {actionSuccess}</span>
          <button onClick={() => setActionSuccess("")} className="text-emerald-400">✕</button>
        </div>
      )}

      {/* 1. ADMIN DASHBOARD */}
      {activeSection === "dashboard" && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/80 via-red-950/50 to-slate-900 border border-rose-500/20 p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-block px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                  Super Admin Management Console
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                  VidyaMarg Central Platform Operations
                </h1>
                <p className="text-slate-300 text-sm mt-1">
                  Global System Health • Role-Based Access Control • Institutional Verification
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-semibold">All Microservices & Databases Healthy</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveSection("logs")}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition-all"
                >
                  View Security Audit Trail 🔒
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <p className="text-slate-400 text-xs">Total Registered Users</p>
              <p className="text-2xl font-black text-white mt-1">2,840</p>
              <p className="text-[11px] text-emerald-400 mt-0.5">Across 5 Roles</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <p className="text-slate-400 text-xs">Pending Institutional Verifications</p>
              <p className="text-2xl font-black text-rose-400 mt-1">
                {pendingColleges.length + pendingCompanies.length}
              </p>
              <p className="text-[11px] text-rose-400 font-medium mt-0.5">Action Required</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <p className="text-slate-400 text-xs">Govt Schemes Active</p>
              <p className="text-2xl font-black text-white mt-1">18</p>
              <p className="text-[11px] text-blue-400 mt-0.5">National & MP State</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <p className="text-slate-400 text-xs">Platform API Security</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">100%</p>
              <p className="text-[11px] text-slate-400 mt-0.5">JWT & RBAC Active</p>
            </div>
          </div>

          {/* Two-Column Grid: Pending Verifications & Security Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Colleges & Companies */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>🏫</span> Pending Institutional Verifications
              </h2>

              {pendingColleges.map((col) => (
                <div key={col.id} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white">{col.name}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
                        College
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{col.code} • {col.district} ({col.accreditation})</p>
                  </div>
                  <button
                    onClick={() => handleVerifyCollege(col.id)}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3.5 py-1.5 rounded-xl shadow-md shadow-emerald-600/20"
                  >
                    Verify 1-Click
                  </button>
                </div>
              ))}

              {pendingCompanies.map((cmp) => (
                <div key={cmp.id} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white">{cmp.name}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 font-semibold">
                        Recruiter
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">CIN: {cmp.cin} • {cmp.industry}</p>
                  </div>
                  <button
                    onClick={() => handleVerifyCompany(cmp.id)}
                    className="text-xs bg-orange-600 hover:bg-orange-500 text-white font-semibold px-3.5 py-1.5 rounded-xl shadow-md shadow-orange-600/20"
                  >
                    Verify Recruiter
                  </button>
                </div>
              ))}
            </div>

            {/* Live Security Audit Trail */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span>📋</span> Live Security Audit Trail
              </h2>
              <div className="space-y-2.5">
                {systemLogs.map((l) => (
                  <div key={l.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-200">{l.action}</p>
                      <p className="text-[10px] text-slate-400">{l.user} • IP: {l.ip}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                          l.status === "WARNING"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {l.status}
                      </span>
                      <p className="text-[9px] text-slate-500 mt-0.5">{l.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. USER MANAGEMENT */}
      {activeSection === "users" && (
        <div className="space-y-4 animate-fadeIn">
          <h2 className="text-xl font-bold text-white">Global User Directory & RBAC Status</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">User Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-white">{u.name}</td>
                    <td className="py-3.5 px-4 text-slate-300">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-slate-800 text-slate-300">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fallback */}
      {!["dashboard", "users"].includes(activeSection) && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center animate-fadeIn">
          <div className="text-4xl mb-3">⚙️</div>
          <h2 className="text-xl font-bold text-white capitalize">{activeSection.replace("-", " ")}</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
            System-level administrative controls with cryptographic audit trail and data backup engines.
          </p>
        </div>
      )}
    </PortalLayout>
  );
}

export default AdminPortal;
