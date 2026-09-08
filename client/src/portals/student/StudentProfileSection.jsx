function StudentProfileSection({ student, onBackToDashboard }) {
  const fields = [
    ["Full name", student?.name],
    ["Email", student?.email],
    ["Phone", student?.phone],
    ["Gender", student?.gender],
    ["Date of birth", student?.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString("en-IN") : null],
    ["Village", student?.village],
    ["District", student?.district],
    ["State", student?.state],
    ["Category", student?.category],
    ["Current class", student?.currentClass],
    ["Stream", student?.stream],
    ["Interested field", student?.interestedField],
    ["Course", student?.course],
    ["Branch", student?.branch],
    ["Semester", student?.semester],
    ["Roll number", student?.rollNo],
  ];

  return <section className="space-y-6 animate-fadeIn">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
      <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">Student identity</p><h1 className="text-2xl font-extrabold text-white mt-1">My profile</h1><p className="text-sm text-slate-400 mt-1">Your profile is read from the connected student record.</p></div>
      <button onClick={onBackToDashboard} className="self-start px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold">Back to dashboard</button>
    </div>
    {!student ? <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center text-sm text-slate-400">Student profile data is not available yet.</div> : <>
      <div className="bg-gradient-to-r from-blue-900/60 to-slate-900 border border-blue-500/20 rounded-3xl p-6 shadow-xl"><div className="flex items-center gap-4"><div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-2xl font-bold text-blue-300">{student.name?.charAt(0) || "S"}</div><div><h2 className="text-xl font-bold text-white">{student.name}</h2><p className="text-sm text-slate-300 mt-1">{[student.course, student.branch, student.currentClass].filter(Boolean).join(" · ") || "Student profile"}</p></div></div></div>
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{fields.map(([label, value]) => <div key={label} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4"><p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p><p className="text-sm text-white mt-1">{value || "Not provided"}</p></div>)}</div><p className="text-xs text-slate-500 mt-5">Profile editing is unavailable because the existing backend exposes no student profile update endpoint.</p></div>
    </>}
  </section>;
}

export default StudentProfileSection;
