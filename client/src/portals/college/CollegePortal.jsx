import { useState, useEffect } from "react";
import PortalLayout from "../../components/common/PortalLayout";
import { useAuth } from "../../context/AuthContext";

function CollegePortal() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState("");

  const [students, setStudents] = useState([
    { id: "s1", name: "Sakir Ali", rollNo: "0103CS211045", branch: "CSE", sem: 6, attendance: 72, cgpa: 8.2, status: "At Risk" },
    { id: "s2", name: "Pooja Sharma", rollNo: "0103CS211046", branch: "CSE", sem: 6, attendance: 92, cgpa: 8.9, status: "Active" },
    { id: "s3", name: "Rahul Verma", rollNo: "0103EC211012", branch: "ECE", sem: 4, attendance: 65, cgpa: 5.8, status: "At Risk" },
    { id: "s4", name: "Ananya Patel", rollNo: "0103IT211008", branch: "IT", sem: 6, attendance: 89, cgpa: 9.1, status: "Placed" },
    { id: "s5", name: "Vikas Meena", rollNo: "0103ME211030", branch: "ME", sem: 4, attendance: 81, cgpa: 7.4, status: "Active" },
  ]);

  const [pendingAchievements, setPendingAchievements] = useState([
    {
      id: "ach1",
      studentName: "Sakir Ali",
      rollNo: "0103CS211045",
      title: "1st Prize - State Level Smart MP Hackathon 2026",
      category: "Hackathon",
      proofUrl: "https://example.com/cert.pdf",
    },
    {
      id: "ach2",
      studentName: "Pooja Sharma",
      rollNo: "0103CS211046",
      title: "AWS Certified Solutions Architect",
      category: "Certification",
      proofUrl: "https://example.com/aws.pdf",
    },
  ]);

  useEffect(() => {
    fetch("/api/college/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("vm_token")}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (res && res.success && res.dashboard.students) {
          setStudents(res.dashboard.students);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApproveAchievement = (id, approved) => {
    setPendingAchievements(pendingAchievements.filter((a) => a.id !== id));
    setActionSuccess(approved ? "Achievement verified and credited to student score!" : "Achievement rejected.");
    setTimeout(() => setActionSuccess(""), 4000);
  };

  const handleNotifyParent = (student) => {
    setActionSuccess(`Automated low attendance warning SMS/Notice dispatched to ${student.name}'s parents!`);
    setTimeout(() => setActionSuccess(""), 4000);
  };

  return (
    <PortalLayout
      currentPortal="college"
      activeSection={activeSection}
      onSelectSection={setActiveSection}
    >
      {actionSuccess && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm flex items-center justify-between animate-fadeIn">
          <span>✅ {actionSuccess}</span>
          <button onClick={() => setActionSuccess("")} className="text-emerald-400">✕</button>
        </div>
      )}

      {/* 1. DASHBOARD */}
      {activeSection === "dashboard" && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-teal-950/50 to-slate-900 border border-emerald-500/20 p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                  College / University Portal
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                  Faculty & Academic Administration
                </h1>
                <p className="text-slate-300 text-sm mt-1">
                  Institute of Engineering & Technology, DAVV (Indore) • Code: RGPV-0103
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-emerald-400 font-semibold">AICTE / UGC Verified Institution</span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setActiveSection("attendance")}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
                >
                  + Mark Attendance
                </button>
                <button
                  onClick={() => setActiveSection("approvals")}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all"
                >
                  Verify Proofs ({pendingAchievements.length})
                </button>
              </div>
            </div>
          </div>

          {/* Quick KPI Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <p className="text-slate-400 text-xs">Total Enrolled Students</p>
              <p className="text-2xl font-black text-white mt-1">1,248</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Across 6 Departments</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <p className="text-slate-400 text-xs">Average Batch Attendance</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">84.2%</p>
              <p className="text-[11px] text-emerald-400 font-medium mt-0.5">Above Min. Threshold</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <p className="text-slate-400 text-xs">At-Risk Dropout Students</p>
              <p className="text-2xl font-black text-rose-400 mt-1">
                {students.filter((s) => s.attendance < 75).length}
              </p>
              <button
                onClick={() => setActiveSection("at-risk")}
                className="text-[11px] text-rose-400 hover:underline font-semibold mt-0.5 block"
              >
                View & Alert Parents →
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <p className="text-slate-400 text-xs">On-Campus Placement Rate</p>
              <p className="text-2xl font-black text-teal-400 mt-1">78.5%</p>
              <p className="text-[11px] text-slate-400 mt-0.5">14 Active Companies</p>
            </div>
          </div>

          {/* Two Columns: At-Risk Monitor & Pending Approvals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* At-Risk Alert Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>⚠️</span> At-Risk Attendance Monitor (&lt; 75%)
                </h2>
                <button onClick={() => setActiveSection("at-risk")} className="text-xs text-emerald-400 hover:underline">
                  Manage All →
                </button>
              </div>

              <div className="space-y-3">
                {students
                  .filter((s) => s.attendance < 75)
                  .map((st) => (
                    <div key={st.id} className="p-3.5 bg-slate-950/60 border border-rose-500/20 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">{st.name}</p>
                        <p className="text-[11px] text-slate-400">Roll: {st.rollNo} • {st.branch} Sem {st.sem}</p>
                        <p className="text-xs font-extrabold text-rose-400 mt-1">Attendance: {st.attendance}%</p>
                      </div>
                      <button
                        onClick={() => handleNotifyParent(st)}
                        className="text-xs bg-rose-600 hover:bg-rose-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-md shadow-rose-600/20"
                      >
                        Notify Parent 📱
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Achievement Approval Queue */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span>🏆</span> Student Achievements for Review
              </h2>
              {pendingAchievements.length === 0 ? (
                <p className="text-xs text-slate-400">All student submissions have been reviewed!</p>
              ) : (
                <div className="space-y-3">
                  {pendingAchievements.map((ach) => (
                    <div key={ach.id} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-white">{ach.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{ach.studentName} ({ach.rollNo})</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-semibold">
                          {ach.category}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleApproveAchievement(ach.id, true)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-1.5 rounded-lg transition-colors"
                        >
                          Approve & Endorse
                        </button>
                        <button
                          onClick={() => handleApproveAchievement(ach.id, false)}
                          className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-1.5 rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. STUDENT MANAGEMENT ROSTER */}
      {activeSection === "students" && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Student Enrollment Directory</h2>
              <p className="text-xs text-slate-400">Comprehensive student records and academic health</p>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20">
              + Enroll New Student
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Student Name</th>
                    <th className="py-3.5 px-4">Roll Number</th>
                    <th className="py-3.5 px-4">Branch / Sem</th>
                    <th className="py-3.5 px-4">Attendance</th>
                    <th className="py-3.5 px-4">CGPA</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{s.name}</td>
                      <td className="py-3.5 px-4 text-slate-300">{s.rollNo}</td>
                      <td className="py-3.5 px-4 text-slate-400">{s.branch} (Sem {s.sem})</td>
                      <td className="py-3.5 px-4">
                        <span className={`font-bold ${s.attendance < 75 ? "text-rose-400" : "text-emerald-400"}`}>
                          {s.attendance}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">{s.cgpa}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            s.status === "At Risk"
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : s.status === "Placed"
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Fallback for other sections */}
      {!["dashboard", "students"].includes(activeSection) && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center animate-fadeIn">
          <div className="text-4xl mb-3">🏫</div>
          <h2 className="text-xl font-bold text-white capitalize">{activeSection.replace("-", " ")}</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
            Integrated with university ERP and automated NAAC/NIRF accreditation analytics engines.
          </p>
        </div>
      )}
    </PortalLayout>
  );
}

export default CollegePortal;
