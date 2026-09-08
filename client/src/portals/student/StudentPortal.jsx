import { useState, useEffect } from "react";
import PortalLayout from "../../components/common/PortalLayout";
import { useAuth } from "../../context/AuthContext";
import {
  applyForJobAPI,
  getAllCollegesAPI,
  getAllScholarshipsAPI,
} from "../../api/studentApi";
import StudentColleges from "./StudentColleges";
import StudentScholarships from "./StudentScholarships";
import StudentProfileSection from "./StudentProfileSection";
import StudentNotifications from "./StudentNotifications";

function StudentPortal({ initialSection = "dashboard" }) {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState(initialSection);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [applySuccess, setApplySuccess] = useState("");
  const [dashboardError, setDashboardError] = useState("");
  const [dashboardColleges, setDashboardColleges] = useState([]);
  const [dashboardScholarships, setDashboardScholarships] = useState([]);
  const [recentlyViewedColleges, setRecentlyViewedColleges] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vm_recent_colleges") || "[]");
    } catch {
      return [];
    }
  });

  // Initial Mock & Live Fallback Data
  const defaultStudent = data?.student || {
    name: user?.name || "Student",
    email: user?.email,
    rollNo: "Not provided",
    course: "Student profile",
    branch: "",
    semester: "",
    college: "",
    cgpa: 0,
    attendanceRate: 0,
    readinessScore: 0,
    skills: [],
  };
  const metrics = data?.metrics || {};
  const profileFields = [
    defaultStudent.name,
    defaultStudent.email,
    defaultStudent.phone,
    defaultStudent.village,
    defaultStudent.district,
    defaultStudent.state,
    defaultStudent.category,
    defaultStudent.currentClass,
    defaultStudent.stream,
    defaultStudent.interestedField,
    defaultStudent.course,
    defaultStudent.branch,
  ];
  const profileCompletion = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);

  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  useEffect(() => {
    if (activeSection === "dashboard") {
      try {
        setRecentlyViewedColleges(JSON.parse(localStorage.getItem("vm_recent_colleges") || "[]"));
      } catch {
        setRecentlyViewedColleges([]);
      }
    }
  }, [activeSection]);

  const [jobs, setJobs] = useState([]);

  const [applications, setApplications] = useState([]);

  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    fetch("/api/student/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("vm_token")}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (res && res.success) {
          setData(res.dashboard);
          setJobs(res.dashboard.recommendedJobs || []);
          setApplications((res.dashboard.applications || []).map((application) => ({
            id: application._id,
            jobTitle: application.jobId?.title || "Job application",
            company: application.companyId?.companyName || "Company",
            status: application.status,
            appliedAt: application.appliedAt ? new Date(application.appliedAt).toLocaleDateString("en-IN") : "Recent",
          })));
          setAchievements(res.dashboard.achievements || []);
        } else {
          setDashboardError("Sign in with a student account to load your live dashboard.");
        }
      })
      .catch(() => setDashboardError("We could not load your dashboard right now."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    Promise.allSettled([getAllCollegesAPI(), getAllScholarshipsAPI()]).then(([collegeResult, scholarshipResult]) => {
      if (collegeResult.status === "fulfilled") setDashboardColleges(collegeResult.value.colleges || []);
      if (scholarshipResult.status === "fulfilled") setDashboardScholarships(scholarshipResult.value.scholarships || []);
    });
  }, []);

  const handleApply = async (job) => {
    try {
      const response = await applyForJobAPI(job._id || job.id, localStorage.getItem("vm_token"));
      setApplications((current) => [{
        id: response.application?._id || `app_${Date.now()}`,
        jobTitle: job.title,
        company: job.companyId?.companyName || job.company || "Company",
        status: "Applied",
        appliedAt: new Date().toLocaleDateString("en-IN"),
      }, ...current]);
      setApplySuccess(response.message || `Application submitted for ${job.title}.`);
    } catch (error) {
      setApplySuccess(error.message || "Unable to submit application.");
    }
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
      {loading && activeSection === "dashboard" && !data && (
        <div className="mb-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center gap-3 text-sm text-slate-400">
          <span className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Loading your student dashboard...
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
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-emerald-400 font-semibold">Profile verified by college</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-3">
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
                        strokeDasharray={`${metrics.readinessScore || defaultStudent.readinessScore}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute font-extrabold text-white text-sm">
                      {metrics.readinessScore || defaultStudent.readinessScore}%
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
                <div className="flex sm:flex-col gap-2">
                  <button
                    onClick={() => setActiveSection("jobs")}
                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-all"
                  >
                    Browse Jobs
                  </button>
                  <button
                    onClick={() => setActiveSection("applications")}
                    className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all"
                  >
                    My Applications
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Profile completion</span>
                <span className="text-lg">✓</span>
              </div>
              <p className="text-2xl font-black text-white">{profileCompletion}%</p>
              <button onClick={() => setActiveSection("profile")} className="text-[11px] text-blue-400 font-medium mt-1 hover:underline">Complete profile</button>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Cumulative CGPA</span>
                <span className="text-lg">📈</span>
              </div>
              <p className="text-2xl font-black text-white">{metrics.cgpa || defaultStudent.cgpa} <span className="text-xs text-slate-400 font-normal">/ 10</span></p>
              <p className="text-[11px] text-emerald-400 font-medium mt-1">Top 5% in Batch</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Attendance Rate</span>
                <span className="text-lg">📅</span>
              </div>
              <p className="text-2xl font-black text-white">{metrics.attendanceRate || defaultStudent.attendanceRate}%</p>
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

          {dashboardError && (
            <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-sm text-amber-300">
              {dashboardError}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div><h2 className="text-base font-bold text-white">Recommended Colleges</h2><p className="text-xs text-slate-400 mt-1">Live records from the college directory.</p></div>
                <button onClick={() => setActiveSection("colleges")} className="text-xs text-blue-400 hover:underline">Browse all</button>
              </div>
              {dashboardColleges.length === 0 ? <p className="text-xs text-slate-500">No college records available.</p> : <div className="space-y-2">{dashboardColleges.slice(0, 3).map((college) => <div key={college._id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl"><p className="text-xs font-bold text-white">{college.name}</p><p className="text-[11px] text-slate-400 mt-1">{[college.district, college.state].filter(Boolean).join(", ")}</p></div>)}</div>}
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div><h2 className="text-base font-bold text-white">Scholarship Opportunities</h2><p className="text-xs text-slate-400 mt-1">Active records available for review.</p></div>
                <button onClick={() => setActiveSection("scholarships")} className="text-xs text-emerald-400 hover:underline">View all</button>
              </div>
              {dashboardScholarships.length === 0 ? <p className="text-xs text-slate-500">No scholarship records available.</p> : <div className="space-y-2">{dashboardScholarships.slice(0, 3).map((scholarship) => <div key={scholarship._id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl"><p className="text-xs font-bold text-white">{scholarship.name}</p><p className="text-[11px] text-emerald-400 mt-1">{scholarship.provider}{scholarship.deadline ? ` · Due ${new Date(scholarship.deadline).toLocaleDateString("en-IN")}` : ""}</p></div>)}</div>}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div><h2 className="text-base font-bold text-white">Recently viewed colleges</h2><p className="text-xs text-slate-400 mt-1">Pick up where you left off.</p></div>
              <button onClick={() => setActiveSection("colleges")} className="text-xs text-blue-400 hover:underline">Explore colleges</button>
            </div>
            {recentlyViewedColleges.length === 0 ? <p className="text-xs text-slate-500">Your viewed college profiles will appear here.</p> : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">{recentlyViewedColleges.map((college) => <button key={college._id} onClick={() => setActiveSection("colleges")} className="text-left p-4 bg-slate-950/60 border border-slate-800 rounded-2xl hover:border-blue-500/40 transition-colors"><p className="text-sm font-bold text-white truncate">{college.name}</p><p className="text-xs text-slate-400 mt-1 truncate">{[college.district, college.state].filter(Boolean).join(", ")}</p></button>)}</div>}
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
                    key={job._id || job.id}
                    className="p-4 bg-slate-950/60 border border-slate-800 hover:border-blue-500/40 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{job.title}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                          {job.jobType || job.type || "Opportunity"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{job.companyId?.companyName || job.company || "Company"} • {job.location || "Location not listed"}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs font-semibold text-emerald-400">{job.ctc || "Compensation not listed"}</span>
                        <span className="text-slate-600">•</span>
                        {(job.skillsRequired || job.skills || []).map((s) => (
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
                {(data?.alerts || []).length === 0 ? <p className="text-xs text-slate-500">No new notifications.</p> : <div className="space-y-2 text-xs">{data.alerts.slice(0, 3).map((alert, index) => <div key={alert._id || alert.id || index} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800"><p className="font-semibold text-white">{alert.title || "Notification"}</p><p className="text-[11px] text-slate-400 mt-0.5">{alert.message || "No additional details."}</p></div>)}</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === "colleges" && <StudentColleges />}

      {activeSection === "scholarships" && <StudentScholarships student={defaultStudent} />}

      {activeSection === "profile" && (
        <StudentProfileSection
          student={defaultStudent}
          onBackToDashboard={() => setActiveSection("dashboard")}
        />
      )}

      {activeSection === "notifications" && <StudentNotifications alerts={data?.alerts || []} />}

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

          {data?.recentExams?.length ? <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{data.recentExams.map((exam) => (
            <div key={exam._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex justify-between items-center mb-2"><span className="text-xs font-bold text-slate-300">{exam.subject}</span><span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">{exam.grade || "Recorded"}</span></div>
              <p className="text-2xl font-extrabold text-white">{exam.marksObtained} <span className="text-xs text-slate-500">/ {exam.totalMarks}</span></p>
              <p className="text-[11px] text-slate-400 mt-1">{exam.examType || "Exam"} · Semester {exam.semester}</p>
            </div>
          ))}</div> : <EmptyPanel message="No exam results are available in your student record yet." />}
        </div>
      )}

      {/* 3. ATTENDANCE TRACKER */}
      {activeSection === "attendance" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-white mb-1">Attendance Record ({metrics.attendanceRate || defaultStudent.attendanceRate}% Overall)</h2>
            <p className="text-xs text-slate-400 mb-6">Subject-wise daily attendance records and alert status</p>

            <div className="space-y-3">
              {data?.recentAttendance?.length ? data.recentAttendance.map((sub) => (
                <div key={sub.subject} className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-white">{sub.subject}</span>
                    <span className={`text-xs font-extrabold ${sub.status === "Present" ? "text-emerald-400" : "text-rose-400"}`}>{sub.status}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                    <div className={`h-full rounded-full ${sub.status === "Present" ? "bg-blue-500 w-full" : "bg-rose-500 w-1/3"}`} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5">{sub.date ? new Date(sub.date).toLocaleDateString("en-IN") : "Recent attendance record"}</p>
                </div>
              )) : <EmptyPanel message="No attendance records are available in your student record yet." />}
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
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl"><p className="text-xs text-slate-400">Academic CGPA</p><p className="text-xl font-bold text-white mt-1">{metrics.cgpa || defaultStudent.cgpa} / 10</p><p className="text-[11px] text-emerald-400 mt-1">From your student record</p></div>
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl"><p className="text-xs text-slate-400">Attendance health</p><p className="text-xl font-bold text-white mt-1">{metrics.attendanceRate || defaultStudent.attendanceRate}%</p><p className="text-[11px] text-emerald-400 mt-1">From recent attendance records</p></div>
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl"><p className="text-xs text-slate-400">Skills</p><p className="text-xl font-bold text-white mt-1">{defaultStudent.skills?.length || 0}</p><p className="text-[11px] text-blue-400 mt-1">Skills in your profile</p></div>
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl"><p className="text-xs text-slate-400">Verified achievements</p><p className="text-xl font-bold text-white mt-1">{metrics.approvedAchievements || achievements.length}</p><p className="text-[11px] text-purple-400 mt-1">From your connected records</p></div>
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
                key={job._id || job.id}
                className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{job.title}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                      {job.jobType || job.type || "Opportunity"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">🏢 {job.companyId?.companyName || job.company || "Company"} • 📍 {job.location || "Location not listed"}</p>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">💰 {job.ctc || "Compensation not listed"} • ⏳ Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString("en-IN") : "Not listed"}</p>
                  <div className="flex gap-1.5 mt-2.5 flex-wrap">
                    {(job.skillsRequired || job.skills || []).map((s) => (
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
      {!["dashboard", "colleges", "scholarships", "profile", "notifications", "academics", "attendance", "readiness", "jobs", "applications"].includes(activeSection) && (
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

function EmptyPanel({ message }) {
  return <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500">{message}</div>;
}

export default StudentPortal;
