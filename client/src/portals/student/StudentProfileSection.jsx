function StudentProfileSection({ student, onBackToDashboard }) {
  if (!student) {
    return <EmptyProfile />;
  }

  const profileFields = [
    student.name,
    student.email,
    student.phone,
    student.gender,
    student.dateOfBirth,
    student.category,
    student.currentClass,
    student.stream,
    student.interestedField,
    student.village,
    student.district,
    student.state,
  ];
  const completion = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);

  return (
    <section className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Account settings</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900">My profile</h1>
          <p className="mt-1 text-sm text-slate-500">Keep your student record complete so recommendations stay relevant.</p>
        </div>
        <button onClick={onBackToDashboard} className="self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700">Back to dashboard</button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-blue-700 text-2xl font-extrabold text-white shadow-lg shadow-blue-700/20">{student.name?.charAt(0)?.toUpperCase() || "S"}</div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Student account</p>
              <h2 className="mt-1 truncate text-xl font-extrabold text-slate-900">{student.name || "Student"}</h2>
              <p className="mt-1 truncate text-sm text-slate-500">{[student.course, student.branch, student.currentClass].filter(Boolean).join(" · ") || "Academic profile"}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Profile completion</p><span className="text-xl font-extrabold text-blue-700">{completion}%</span></div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${completion}%` }} /></div>
          <p className="mt-3 text-xs leading-5 text-slate-500">Complete your connected student record to improve college and scholarship matches.</p>
        </div>
      </div>

      <ProfileGroup title="Personal information" description="Contact and identity details from your student record." fields={[
        ["Full name", student.name], ["Email", student.email], ["Phone", student.phone], ["Gender", student.gender], ["Date of birth", formatDate(student.dateOfBirth)], ["Category", student.category],
      ]} />
      <ProfileGroup title="Academic information" description="Your current academic track and study interests." fields={[
        ["Current class", student.currentClass], ["Stream", student.stream], ["Course", student.course], ["Branch", student.branch], ["Semester", student.semester], ["Roll number", student.rollNo], ["Interested field", student.interestedField],
      ]} />
      <ProfileGroup title="Location information" description="Used to tailor nearby college and opportunity recommendations." fields={[
        ["Village", student.village], ["District", student.district], ["State", student.state], ["Address", student.address],
      ]} />

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800">
        Profile editing is not enabled because the existing backend does not expose a student profile update endpoint. These values are read directly from the connected student record.
      </div>
    </section>
  );
}

function ProfileGroup({ title, description, fields }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5"><h2 className="text-base font-extrabold text-slate-900">{title}</h2><p className="mt-1 text-xs text-slate-500">{description}</p></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map(([label, value]) => <div key={label} className="border-b border-slate-100 pb-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-slate-800">{value || "Not provided"}</p></div>)}
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN");
}

function EmptyProfile() {
  return <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">Student profile data is not available yet.</div>;
}

export default StudentProfileSection;
