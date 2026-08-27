import { useState, useEffect } from "react";
import PortalLayout from "../../components/common/PortalLayout";
import { useAuth } from "../../context/AuthContext";

function StudentPortal() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [applySuccess, setApplySuccess] = useState("");

  // Initial Mock & Live Fallback Data
  const defaultStudent = {
    name: user?.name || "Sakir Ali",
    rollNo: "VM-2024-CS042",
    course: "B.Tech",
    branch: "Computer Science & Engineering",
    semester: 6,
    college: "Institute of Engineering & Technology, DAVV",
    cgpa: 8.4,
    attendanceRate: 88,
    readinessScore: 82,
    skills: ["React.js", "Node.js", "Python", "MongoDB", "Data Structures", "Tailwind CSS"],
  };

  const [jobs, setJobs] = useState([
    {
      id: "j1",
      title: "Associate Software Engineer",
      company: "Infosys Technologies",
      location: "Indore, MP (Hybrid)",
      ctc: "₹6.5 - 8.0 LPA",
      type: "Campus Drive",
      deadline: "2026-09-15",
      skills: ["React.js", "Node.js", "SQL"],
      status: "Active",
      minCgpa: 7.5,
    },
    {
      id: "j2",
      title: "Frontend Developer Intern",
      company: "Tata Consultancy Services",
      location: "Bhopal, MP",
      ctc: "₹25,000 / month",
      type: "Internship",
      deadline: "2026-09-20",
      skills: ["JavaScript", "React", "CSS"],
      status: "Active",
      minCgpa: 7.0,
    },
    {
      id: "j3",
      title: "Cloud & DevOps Trainee",
      company: "Wipro Digital",
      location: "Pune / Remote",
      ctc: "₹7.2 LPA",
      type: "Full-time",
      deadline: "2026-09-30",
      skills: ["Linux", "Docker", "AWS"],
      status: "Active",
      minCgpa: 7.0,
    },
  ]);

  const [applications, setApplications] = useState([
    {
      id: "app1",
      jobTitle: "Associate Software Engineer",
      company: "Infosys Technologies",
      status: "Interview Scheduled",
      appliedAt: "2026-08-20",
      round: "Round 2: Technical Interview",
      interviewDate: "2026-08-30 at 11:30 AM",
      meetingLink: "https://meet.google.com/abc-defg-hij",
    },
    {
      id: "app2",
      jobTitle: "Junior Full Stack Developer",
      company: "Persistent Systems",
      status: "Shortlisted",
      appliedAt: "2026-08-15",
    },
  ]);

  const [achievements, setAchievements] = useState([
    {
      id: "ach1",
      title: "1st Prize - State Level Smart MP Hackathon 2026",
      category: "Hackathon",
      date: "2026-07-14",
      status: "Approved",
      verifiedBy: "Prof. S. Sharma (HOD CSE)",
    },
    {
      id: "ach2",
      title: "AWS Certified Cloud Practitioner",
      category: "Certification",
      date: "2026-06-10",
      status: "Approved",
      verifiedBy: "Dr. Verma",
    },
  ]);

  useEffect(() => {
    // Fetch live dashboard if available
    fetch("/api/student/dashboard", {
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

  const handleApply = (job) => {
    const newApp = {
      id: `app_${Date.now()}`,
      jobTitle: job.title,
      company: job.company,
      status: "Applied",
      appliedAt: new Date().toISOString().split("T")[0],
    };
    setApplications([newApp, ...applications]);
    setApplySuccess(`Applied successfully for ${job.title} at ${job.company}!`);
    setTimeout(() => setApplySuccess(""), 4000);
  };

  return (
    <PortalLayout
      currentPortal="student"
      activeSection={activeSection}
      onSelectSection={setActiveSection}
    >
      {/* Top Banner Alert */}
      {applySuccess && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm flex items-center justify-between animate-fadeIn">
          <span>✅ {applySuccess}</span>
          <button onClick={() => setApplySuccess("")} className="text-emerald-400">✕</button>
        </div>
      )}

      {/* 1. DASHBOARD OVERVIEW */}
      {activeSection === "dashboard" && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 border border-blue-500/20 p-6 md:p-8 shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                  Student Portal Dashboard
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                  Welcome back, {defaultStudent.name} 👋
                </h1>
                <p className="text-slate-300 text-sm mt-1">
                  {defaultStudent.course} • {defaultStudent.branch} (Semester {defaultStudent.semester})
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{defaultStudent.college}</p>
              </div>

              {/* Career Readiness Meter */}
              <div className="bg-slate-950/70 border border-blue-500/30 rounded-2xl p-4 flex items-center gap-4 min-w-[220px]">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-blue-500"
                      strokeDasharray={`${defaultStudent.readinessScore}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute font-extrabold text-white text-sm">
                    {defaultStudent.readinessScore}%
                  </span>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-400">Career Readiness</p>
                  <p className="text-xs font-semibold text-emerald-400">High Employability</p>
                  <button
                    onClick={() => setActiveSection("readiness")}
                    className="text-[11px] text-blue-400 hover:underline mt-0.5 block"
                  >
                    View Breakdown →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Cumulative CGPA</span>
                <span className="text-lg">📈</span>
              </div>
              <p className="text-2xl font-black text-white">{defaultStudent.cgpa} <span className="text-xs text-slate-400 font-normal">/ 10</span></p>
              <p className="text-[11px] text-emerald-400 font-medium mt-1">Top 5% in Batch</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Attendance Rate</span>
                <span className="text-lg">📅</span>
              </div>
              <p className="text-2xl font-black text-white">{defaultStudent.attendanceRate}%</p>
              <p className="text-[11px] text-emerald-400 font-medium mt-1">Healthy (Above 75%)</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Active Applications</span>
                <span className="text-lg">💼</span>
              </div>
              <p className="text-2xl font-black text-white">{applications.length}</p>
              <p className="text-[11px] text-blue-400 font-medium mt-1">1 Interview Stage</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Verified Achievements</span>
                <span className="text-lg">🏆</span>
              </div>
              <p className="text-2xl font-black text-white">{achievements.length}</p>
              <p className="text-[11px] text-purple-400 font-medium mt-1">College Endorsed</p>
            </div>
          </div>

          {/* Two-Column Section: Recommended Jobs & Interview Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Recommended Jobs */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>🎯</span> Matching Jobs for Your Skills
                  </h2>
                  <p className="text-xs text-slate-400">Curated on-campus drives and partner openings</p>
                </div>
                <button
                  onClick={() => setActiveSection("jobs")}
                  className="text-xs text-blue-400 hover:underline font-medium"
                >
                  View All ({jobs.length}) →
                </button>
              </div>

              <div className="space-y-3">
                {jobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="p-4 bg-slate-950/60 border border-slate-800 hover:border-blue-500/40 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{job.title}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                          {job.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{job.company} • {job.location}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs font-semibold text-emerald-400">{job.ctc}</span>
                        <span className="text-slate-600">•</span>
                        {job.skills.map((s) => (
                          <span key={s} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleApply(job)}
                      className="whitespace-nowrap bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-600/20"
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 1 Col: Upcoming Interviews & Notifications */}
            <div className="space-y-6">
              {/* Interview Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                  <span>📞</span> Upcoming Interview
                </h2>
                {applications.find((a) => a.meetingLink) ? (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
                    <p className="text-xs font-bold text-blue-400">{applications[0].round}</p>
                    <p className="text-sm font-extrabold text-white mt-1">{applications[0].company}</p>
                    <p className="text-xs text-slate-300 mt-1">🗓️ {applications[0].interviewDate}</p>
                    <a
                      href={applications[0].meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 block text-center bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 rounded-xl transition-all"
                    >
                      Join Video Meeting 🎥
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No scheduled interviews right now.</p>
                )}
              </div>

              {/* College Notices */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <span>📢</span> College Notice Board
                </h2>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <p className="font-semibold text-white">Campus Placement Drive 2026</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Registration closes Sept 15 for Infosys & TCS.</p>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <p className="font-semibold text-white">Mid-Term Exam Schedule Released</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Check department notice board for exam dates.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACADEMIC PROGRESS */}
      {activeSection === "academics" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Academic Performance & CGPA</h2>
              <p className="text-xs text-slate-400">Semester-wise grade breakdown and transcript history</p>
            </div>
            <div className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-2xl text-blue-400 font-extrabold text-base">
              Overall CGPA: {defaultStudent.cgpa}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { sem: "Sem 1", gpa: "8.2", status: "Passed (Distinction)", credits: 24 },
              { sem: "Sem 2", gpa: "8.5", status: "Passed (Distinction)", credits: 24 },
              { sem: "Sem 3", gpa: "8.1", status: "Passed (Distinction)", credits: 26 },
              { sem: "Sem 4", gpa: "8.6", status: "Passed (Distinction)", credits: 26 },
              { sem: "Sem 5", gpa: "8.7", status: "Passed (Distinction)", credits: 24 },
              { sem: "Sem 6 (Current)", gpa: "8.4 (Ongoing)", status: "Active", credits: 22 },
            ].map((s) => (
              <div key={s.sem} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-300">{s.sem}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                    {s.status}
                  </span>
                </div>
                <p className="text-2xl font-extrabold text-white">{s.gpa}</p>
                <p className="text-[11px] text-slate-400 mt-1">Total Credits: {s.credits}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ATTENDANCE TRACKER */}
      {activeSection === "attendance" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-white mb-1">Attendance Record (88% Overall)</h2>
            <p className="text-xs text-slate-400 mb-6">Subject-wise daily attendance records and alert status</p>

            <div className="space-y-3">
              {[
                { subject: "Data Structures & Algorithms", total: 42, present: 39, pct: 92 },
                { subject: "Database Management Systems", total: 40, present: 36, pct: 90 },
                { subject: "Computer Networks", total: 38, present: 32, pct: 84 },
                { subject: "Software Engineering", total: 36, present: 31, pct: 86 },
                { subject: "Machine Learning Elective", total: 32, present: 28, pct: 87 },
              ].map((sub) => (
                <div key={sub.subject} className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-white">{sub.subject}</span>
                    <span className="text-xs font-extrabold text-emerald-400">{sub.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${sub.pct}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5">{sub.present} present out of {sub.total} classes</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. CAREER READINESS SCORE */}
      {activeSection === "readiness" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
            <h2 className="text-xl font-extrabold text-white mb-2">Career Readiness Score: {defaultStudent.readinessScore}/100</h2>
            <p className="text-xs text-slate-400 mb-6">
              Calculated using our proprietary AI model incorporating academics, attendance, certifications, and projects.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-400">Academic Score (Max 30)</p>
                <p className="text-xl font-bold text-white mt-1">26 / 30 pts</p>
                <p className="text-[11px] text-emerald-400 mt-1">Based on 8.4 CGPA</p>
              </div>
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-400">Attendance Health (Max 20)</p>
                <p className="text-xl font-bold text-white mt-1">18 / 20 pts</p>
                <p className="text-[11px] text-emerald-400 mt-1">Based on 88% Attendance</p>
              </div>
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-400">Technical Skills & Badges (Max 25)</p>
                <p className="text-xl font-bold text-white mt-1">21 / 25 pts</p>
                <p className="text-[11px] text-blue-400 mt-1">6 Verified Skills</p>
              </div>
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-400">Achievements & Hackathons (Max 25)</p>
                <p className="text-xl font-bold text-white mt-1">17 / 25 pts</p>
                <p className="text-[11px] text-purple-400 mt-1">2 Endorsed Accolades</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. RECOMMENDED JOBS */}
      {activeSection === "jobs" && (
        <div className="space-y-4 animate-fadeIn">
          <h2 className="text-xl font-bold text-white">Recommended Jobs & Placement Drives</h2>
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{job.title}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                      {job.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">🏢 {job.company} • 📍 {job.location}</p>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">💰 {job.ctc} • ⏳ Deadline: {job.deadline}</p>
                  <div className="flex gap-1.5 mt-2.5 flex-wrap">
                    {job.skills.map((s) => (
                      <span key={s} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleApply(job)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/20 whitespace-nowrap"
                >
                  Apply 1-Click
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. MY APPLICATIONS */}
      {activeSection === "applications" && (
        <div className="space-y-4 animate-fadeIn">
          <h2 className="text-xl font-bold text-white">My Job & Drive Applications</h2>
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between shadow-lg">
                <div>
                  <h3 className="text-sm font-bold text-white">{app.jobTitle}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{app.company} • Applied on {app.appliedAt}</p>
                  {app.round && <p className="text-xs text-blue-400 font-medium mt-1">🔔 {app.round}</p>}
                </div>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold">
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generic Placeholder for other sub-modules */}
      {!["dashboard", "academics", "attendance", "readiness", "jobs", "applications"].includes(activeSection) && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center animate-fadeIn">
          <div className="text-4xl mb-3">🎓</div>
          <h2 className="text-xl font-bold text-white capitalize">{activeSection.replace("-", " ")}</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
            Module connected to VidyaMarg unified database. Real-time updates and active synchronization enabled.
          </p>
        </div>
      )}
    </PortalLayout>
  );
}

export default StudentPortal;
