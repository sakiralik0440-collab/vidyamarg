import { useState, useEffect } from "react";
import PortalLayout from "../../components/common/PortalLayout";
import { useAuth } from "../../context/AuthContext";

function CompanyPortal() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState("");
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [jobForm, setJobForm] = useState({
    title: "",
    ctc: "",
    location: "Indore, MP",
    jobType: "Campus Drive",
    minCgpa: "7.0",
    skills: "React, Node.js, JavaScript",
    description: "",
  });

  const [interviewForm, setInterviewForm] = useState({
    round: "Technical Interview Round 1",
    date: "2026-09-02",
    time: "11:00 AM",
    meetingLink: "https://meet.google.com/new-drive-slot",
  });

  const [jobs, setJobs] = useState([
    {
      id: "j1",
      title: "Associate Software Engineer",
      type: "Campus Drive",
      location: "Indore (Hybrid)",
      ctc: "₹7.5 LPA",
      applicantsCount: 42,
      shortlistedCount: 8,
      status: "Active",
    },
    {
      id: "j2",
      title: "Frontend Developer Intern",
      type: "Internship",
      location: "Indore, MP",
      ctc: "₹25,000 / mo",
      applicantsCount: 68,
      shortlistedCount: 12,
      status: "Active",
    },
  ]);

  const [applicants, setApplicants] = useState([
    {
      id: "app1",
      name: "Sakir Ali",
      rollNo: "0103CS211045",
      course: "B.Tech CSE (DAVV)",
      cgpa: 8.4,
      readinessScore: 82,
      skills: ["React.js", "Node.js", "MongoDB", "Python"],
      appliedJob: "Associate Software Engineer",
      status: "Shortlisted",
    },
    {
      id: "app2",
      name: "Pooja Sharma",
      rollNo: "0103CS211046",
      course: "B.Tech CSE (DAVV)",
      cgpa: 8.9,
      readinessScore: 90,
      skills: ["AWS", "Docker", "Java", "React"],
      appliedJob: "Associate Software Engineer",
      status: "Interview Scheduled",
    },
    {
      id: "app3",
      name: "Rahul Verma",
      rollNo: "0103EC211012",
      course: "B.Tech ECE (DAVV)",
      cgpa: 7.8,
      readinessScore: 74,
      skills: ["Embedded C", "Python", "IoT"],
      appliedJob: "Associate Software Engineer",
      status: "Applied",
    },
  ]);

  useEffect(() => {
    fetch("/api/company-portal/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("vm_token")}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (res && res.success && res.dashboard.jobs) {
          setJobs(res.dashboard.jobs);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePostJob = (e) => {
    e.preventDefault();
    const newJob = {
      id: `job_${Date.now()}`,
      title: jobForm.title,
      type: jobForm.jobType,
      location: jobForm.location,
      ctc: jobForm.ctc,
      applicantsCount: 0,
      shortlistedCount: 0,
      status: "Active",
    };
    setJobs([newJob, ...jobs]);
    setPostModalOpen(false);
    setActionSuccess(`Campus Drive posting "${jobForm.title}" published!`);
    setTimeout(() => setActionSuccess(""), 4000);
  };

  const handleScheduleInterviewSubmit = (e) => {
    e.preventDefault();
    if (selectedCandidate) {
      setApplicants(
        applicants.map((a) => (a.id === selectedCandidate.id ? { ...a, status: "Interview Scheduled" } : a))
      );
      setActionSuccess(`Interview scheduled for ${selectedCandidate.name} on ${interviewForm.date} at ${interviewForm.time}!`);
      setInterviewModalOpen(false);
      setTimeout(() => setActionSuccess(""), 4000);
    }
  };

  const handleStatusChange = (appId, newStatus) => {
    setApplicants(applicants.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)));
    setActionSuccess(`Candidate status updated to "${newStatus}"!`);
    setTimeout(() => setActionSuccess(""), 3000);
  };

  return (
    <PortalLayout
      currentPortal="company"
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
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-950/80 via-amber-950/50 to-slate-900 border border-orange-500/20 p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                  Recruiter & ATS Portal
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                  Corporate Talent Pipeline
                </h1>
                <p className="text-slate-300 text-sm mt-1">
                  Infosys Technologies Ltd. • Recruiter ID: REC-5421
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-emerald-400 font-semibold">Verified Corporate Recruiter</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPostModalOpen(true)}
                  className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-orange-600/20 transition-all"
                >
                  + Post New Job / Drive
                </button>
              </div>
            </div>
          </div>

          {/* Quick ATS Funnel Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <p className="text-slate-400 text-xs">Active Drives Posted</p>
              <p className="text-2xl font-black text-white mt-1">{jobs.length}</p>
              <p className="text-[11px] text-orange-400 font-medium mt-0.5">3 Participating Colleges</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <p className="text-slate-400 text-xs">Total Applications Received</p>
              <p className="text-2xl font-black text-white mt-1">110</p>
              <p className="text-[11px] text-blue-400 font-medium mt-0.5">+18 this week</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <p className="text-slate-400 text-xs">Shortlisted Candidates</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">20</p>
              <p className="text-[11px] text-emerald-400 font-medium mt-0.5">Ready for interviews</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <p className="text-slate-400 text-xs">Offers Extended</p>
              <p className="text-2xl font-black text-purple-400 mt-1">6</p>
              <p className="text-[11px] text-purple-400 font-medium mt-0.5">5 Accepted</p>
            </div>
          </div>

          {/* Candidate Applications Pipeline Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>📥</span> Candidate Applicant Pipeline
                </h2>
                <p className="text-xs text-slate-400">Review dossiers, readiness scores, and schedule interview rounds</p>
              </div>
              <button
                onClick={() => setActiveSection("candidates")}
                className="text-xs text-orange-400 hover:underline"
              >
                Search Talent Pool →
              </button>
            </div>

            <div className="space-y-3">
              {applicants.map((cand) => (
                <div
                  key={cand.id}
                  className="p-4 bg-slate-950/60 border border-slate-800 hover:border-orange-500/40 rounded-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{cand.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        Readiness: {cand.readinessScore}%
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold">
                        CGPA: {cand.cgpa}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{cand.course} • Applied for {cand.appliedJob}</p>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {cand.skills.map((s) => (
                        <span key={s} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedCandidate(cand);
                        setInterviewModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-orange-600/20"
                    >
                      Schedule Interview 📞
                    </button>
                    <button
                      onClick={() => handleStatusChange(cand.id, "Selected")}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl"
                    >
                      Make Offer 📜
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Publish Campus Placement Drive / Job</h3>
            <form onSubmit={handlePostJob} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Job / Role Title</label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g. Associate Software Engineer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">CTC / Salary Package</label>
                  <input
                    type="text"
                    required
                    value={jobForm.ctc}
                    onChange={(e) => setJobForm({ ...jobForm, ctc: e.target.value })}
                    placeholder="e.g. ₹7.5 LPA"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Min CGPA Cutoff</label>
                  <input
                    type="text"
                    value={jobForm.minCgpa}
                    onChange={(e) => setJobForm({ ...jobForm, minCgpa: e.target.value })}
                    placeholder="e.g. 7.0"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setPostModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl"
                >
                  Publish Drive 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {interviewModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Schedule Interview</h3>
            <p className="text-xs text-slate-400 mb-4">Candidate: {selectedCandidate.name} ({selectedCandidate.rollNo})</p>
            <form onSubmit={handleScheduleInterviewSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Interview Round</label>
                <input
                  type="text"
                  value={interviewForm.round}
                  onChange={(e) => setInterviewForm({ ...interviewForm, round: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={interviewForm.date}
                    onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={interviewForm.time}
                    onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Google Meet / Video Link</label>
                <input
                  type="text"
                  value={interviewForm.meetingLink}
                  onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setInterviewModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl"
                >
                  Confirm & Send Alert 📅
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fallback */}
      {activeSection !== "dashboard" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center animate-fadeIn">
          <div className="text-4xl mb-3">🏢</div>
          <h2 className="text-xl font-bold text-white capitalize">{activeSection.replace("-", " ")}</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
            Automated campus recruitment pipeline linked with university placement cells.
          </p>
        </div>
      )}
    </PortalLayout>
  );
}

export default CompanyPortal;
