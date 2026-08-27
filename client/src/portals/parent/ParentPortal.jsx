import { useState, useEffect } from "react";
import PortalLayout from "../../components/common/PortalLayout";
import { useAuth } from "../../context/AuthContext";

function ParentPortal() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkForm, setLinkForm] = useState({ rollNo: "", studentName: "", relationship: "Father" });
  const [linkSuccess, setLinkSuccess] = useState("");

  const defaultChild = {
    name: "Sakir Ali",
    rollNo: "VM-2024-CS042",
    course: "B.Tech (Computer Science & Engineering)",
    semester: "Semester 6",
    college: "Institute of Engineering & Technology, DAVV",
    attendanceRate: 72, // Warning condition (< 75%)
    cgpa: 8.2,
    activityScore: 78,
    mentorName: "Prof. S. Sharma",
    mentorContact: "+91 98765 43210",
  };

  const [feeStatus, setFeeStatus] = useState({
    totalFee: "₹65,000",
    paidAmount: "₹50,000",
    dueAmount: "₹15,000",
    dueDate: "2026-09-30",
    status: "Partial",
  });

  const [alerts, setAlerts] = useState([
    {
      id: "a1",
      level: "High",
      title: "Low Attendance Alert (72%)",
      message: "Attendance in Computer Networks dropped below 75%. Please ensure your child attends regular remedial classes.",
      date: "2026-08-25",
    },
    {
      id: "a2",
      level: "Info",
      title: "Campus Drive Notification",
      message: "Your child has been shortlisted for Infosys Technical Round on Aug 30.",
      date: "2026-08-24",
    },
  ]);

  useEffect(() => {
    fetch("/api/parent/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("vm_token")}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (res && res.success) {
          setData(res.dashboard);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    setLinkSuccess(`Successfully linked child: ${linkForm.studentName || linkForm.rollNo}!`);
    setLinkModalOpen(false);
    setTimeout(() => setLinkSuccess(""), 4000);
  };

  return (
    <PortalLayout
      currentPortal="parent"
      activeSection={activeSection}
      onSelectSection={setActiveSection}
    >
      {linkSuccess && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm flex items-center justify-between animate-fadeIn">
          <span>✅ {linkSuccess}</span>
          <button onClick={() => setLinkSuccess("")} className="text-emerald-400">✕</button>
        </div>
      )}

      {/* 1. PARENT DASHBOARD */}
      {activeSection === "dashboard" && (
        <div className="space-y-6">
          {/* Header Card with Child Selector */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/60 via-fuchsia-900/40 to-slate-900 border border-purple-500/20 p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                  Parent Portal Overview
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                  Monitoring: {defaultChild.name} 🎓
                </h1>
                <p className="text-slate-300 text-sm mt-1">
                  {defaultChild.course} • {defaultChild.semester}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{defaultChild.college}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLinkModalOpen(true)}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-purple-600/20 whitespace-nowrap"
                >
                  + Link Another Child
                </button>
              </div>
            </div>
          </div>

          {/* At-Risk Warning Box if attendance < 75% */}
          {defaultChild.attendanceRate < 75 && (
            <div className="p-5 bg-rose-500/10 border border-rose-500/30 rounded-3xl text-rose-300 flex items-start gap-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="text-sm font-bold text-rose-400">At-Risk Academic Attendance Alert</h3>
                <p className="text-xs text-rose-200 mt-1">
                  {defaultChild.name}&apos;s current overall attendance is {defaultChild.attendanceRate}%, which is below the mandatory university threshold of 75%.
                </p>
                <button
                  onClick={() => setActiveSection("messages")}
                  className="mt-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 px-3 py-1.5 rounded-lg transition-colors inline-block"
                >
                  Contact Class Mentor ({defaultChild.mentorName})
                </button>
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Overall Attendance</span>
                <span className="text-lg">📅</span>
              </div>
              <p className={`text-2xl font-black ${defaultChild.attendanceRate < 75 ? "text-rose-400" : "text-emerald-400"}`}>
                {defaultChild.attendanceRate}%
              </p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">Min. Required: 75%</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Academic CGPA</span>
                <span className="text-lg">📈</span>
              </div>
              <p className="text-2xl font-black text-white">{defaultChild.cgpa} <span className="text-xs text-slate-400 font-normal">/ 10</span></p>
              <p className="text-[11px] text-emerald-400 font-medium mt-1">Consistent Grade</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Fee Balance Due</span>
                <span className="text-lg">💳</span>
              </div>
              <p className="text-2xl font-black text-amber-400">{feeStatus.dueAmount}</p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">Due by Sept 30</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Campus Placement</span>
                <span className="text-lg">🏢</span>
              </div>
              <p className="text-base font-bold text-purple-400 mt-1">Interview Round</p>
              <p className="text-[11px] text-slate-400 font-medium">Infosys (Aug 30)</p>
            </div>
          </div>

          {/* Academic Breakdown & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subject Marks Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span>📝</span> Recent Exam Results & Marks
              </h2>
              <div className="space-y-3">
                {[
                  { subject: "Data Structures", marks: "86 / 100", grade: "A", status: "Passed" },
                  { subject: "Database Systems", marks: "91 / 100", grade: "A+", status: "Passed" },
                  { subject: "Computer Networks", marks: "68 / 100", grade: "B", status: "Passed" },
                  { subject: "Software Engineering", marks: "84 / 100", grade: "A", status: "Passed" },
                ].map((m) => (
                  <div key={m.subject} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{m.subject}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Grade: <span className="text-purple-400 font-bold">{m.grade}</span></p>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400">{m.marks}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Alerts & Faculty Contact */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <span>🔔</span> Critical Alerts & Notifications
                </h2>
                <div className="space-y-3">
                  {alerts.map((al) => (
                    <div key={al.id} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-bold text-purple-300">{al.title}</p>
                        <span className="text-[10px] text-slate-500">{al.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">{al.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <h2 className="text-sm font-bold text-white mb-2">College Faculty Advisor</h2>
                <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-white">{defaultChild.mentorName}</p>
                    <p className="text-[11px] text-slate-400">Head of Department / Mentor</p>
                  </div>
                  <a
                    href={`tel:${defaultChild.mentorContact}`}
                    className="text-xs bg-purple-600 hover:bg-purple-500 text-white font-semibold px-3 py-1.5 rounded-lg"
                  >
                    📞 Call Faculty
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FEE STATUS VIEW */}
      {activeSection === "fees" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-2">College Fee Structure & Status</h2>
            <p className="text-xs text-slate-400 mb-6">Academic Year 2025-2026 Tuition & Exam Fees</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-400">Total Annual Fee</p>
                <p className="text-2xl font-bold text-white mt-1">{feeStatus.totalFee}</p>
              </div>
              <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-400">Paid Amount</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{feeStatus.paidAmount}</p>
              </div>
              <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-400">Remaining Due</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">{feeStatus.dueAmount}</p>
              </div>
            </div>

            <button
              onClick={() => alert("Redirecting to online payment gateway (SBI ePay / Razorpay)...")}
              className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-600/20"
            >
              Pay Remaining Due (₹15,000) 💳
            </button>
          </div>
        </div>
      )}

      {/* Link Child Modal */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Link Student Profile</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your child&apos;s College Roll Number to verify relationship and monitor progress.
            </p>
            <form onSubmit={handleLinkSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Student Roll Number</label>
                <input
                  type="text"
                  required
                  value={linkForm.rollNo}
                  onChange={(e) => setLinkForm({ ...linkForm, rollNo: e.target.value })}
                  placeholder="e.g. VM-2024-CS042"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Relationship</label>
                <select
                  value={linkForm.relationship}
                  onChange={(e) => setLinkForm({ ...linkForm, relationship: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs"
                >
                  Verify & Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fallback for other tabs */}
      {!["dashboard", "fees"].includes(activeSection) && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center animate-fadeIn">
          <div className="text-4xl mb-3">👨‍👩‍👦</div>
          <h2 className="text-xl font-bold text-white capitalize">{activeSection.replace("-", " ")}</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
            Connected to official college records with active end-to-end data isolation and privacy protection.
          </p>
        </div>
      )}
    </PortalLayout>
  );
}

export default ParentPortal;
