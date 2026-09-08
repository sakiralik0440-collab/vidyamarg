import { useEffect, useMemo, useState } from "react";
import { getAllScholarshipsAPI } from "../../api/studentApi";

function StudentScholarships({ student }) {
  const [scholarships, setScholarships] = useState([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All types");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAllScholarshipsAPI()
      .then((response) => {
        if (active) setScholarships(response.scholarships || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load scholarships");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredScholarships = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return scholarships.filter((scholarship) => {
      const searchableText = [scholarship.name, scholarship.provider, scholarship.type, scholarship.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return (
        (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
        (type === "All types" || scholarship.type === type)
      );
    });
  }, [query, scholarships, type]);

  const studentSummary = [student?.category, student?.stream, student?.state].filter(Boolean).join(" / ");

  return (
    <section className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">Financial support</p>
          <h1 className="text-2xl font-extrabold text-white mt-1">Scholarships</h1>
          <p className="text-sm text-slate-400 mt-1">Browse active scholarship records and application links.</p>
        </div>
        {studentSummary && <span className="text-xs text-slate-500">Profile: {studentSummary}</span>}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-5 shadow-xl flex flex-col md:flex-row gap-3">
        <label className="relative flex-1">
          <span className="sr-only">Search scholarships</span>
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search scholarship or provider" className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500" />
        </label>
        <select value={type} onChange={(event) => setType(event.target.value)} className="md:w-56 bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-emerald-500">
          <option>All types</option>
          <option>Central Government</option>
          <option>State Government</option>
          <option>Private</option>
          <option>NGO</option>
        </select>
      </div>

      {error && <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-sm text-rose-300">{error}</div>}
      {loading && <LoadingState />}
      {!loading && !error && filteredScholarships.length === 0 && <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center"><div className="text-3xl">₹</div><h2 className="text-base font-bold text-white mt-3">No scholarships found</h2><p className="text-xs text-slate-400 mt-1">Try another search or filter.</p></div>}
      {!loading && filteredScholarships.length > 0 && <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredScholarships.map((scholarship) => <ScholarshipCard key={scholarship._id} scholarship={scholarship} />)}
      </div>}
    </section>
  );
}

function ScholarshipCard({ scholarship }) {
  const deadline = scholarship.deadline ? new Date(scholarship.deadline) : null;
  const deadlineLabel = deadline && !Number.isNaN(deadline.getTime()) ? deadline.toLocaleDateString("en-IN") : "Not listed";
  const amount = scholarship.amount ? `Rs ${scholarship.amount.toLocaleString("en-IN")}` : scholarship.amountDescription || "Amount not listed";
  return <article className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg hover:border-emerald-500/40 transition-colors">
    <div className="flex items-start justify-between gap-3">
      <div><p className="text-[10px] font-bold uppercase tracking-wide text-emerald-400">{scholarship.type || "Scholarship"}</p><h2 className="text-base font-bold text-white mt-1">{scholarship.name}</h2><p className="text-xs text-slate-400 mt-1">{scholarship.provider}</p></div>
      <span className="text-sm font-bold text-emerald-400 whitespace-nowrap">{amount}</span>
    </div>
    {scholarship.description && <p className="text-xs text-slate-300 mt-4 line-clamp-3">{scholarship.description}</p>}
    <div className="grid grid-cols-2 gap-2 mt-4"><Info label="Deadline" value={deadlineLabel} /><Info label="Minimum marks" value={scholarship.eligibility?.minMarks ? `${scholarship.eligibility.minMarks}%` : "Not listed"} /></div>
    {scholarship.eligibility?.categories?.length > 0 && <p className="text-[11px] text-slate-500 mt-3">Categories: <span className="text-slate-300">{scholarship.eligibility.categories.join(", ")}</span></p>}
    {scholarship.applicationLink && <a href={scholarship.applicationLink} target="_blank" rel="noreferrer" className="inline-block mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold">Open application</a>}
  </article>;
}

function Info({ label, value }) {
  return <div className="bg-slate-950/70 rounded-xl p-3"><p className="text-[10px] text-slate-500">{label}</p><p className="text-xs font-semibold text-white mt-1">{value}</p></div>;
}

function LoadingState() {
  return <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" /><p className="text-xs text-slate-400 mt-3">Loading scholarships from the database...</p></div>;
}

export default StudentScholarships;
