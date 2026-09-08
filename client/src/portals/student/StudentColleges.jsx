import { useEffect, useMemo, useState } from "react";
import { getAllCollegesAPI, getCollegeByIdAPI } from "../../api/studentApi";

function StudentColleges() {
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState("All districts");
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const timer = setTimeout(() => getAllCollegesAPI({
      search: query.trim(),
      district: district === "All districts" ? "" : district,
    })
      .then((response) => {
        if (active) setColleges(response.colleges || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load colleges");
      })
      .finally(() => {
        if (active) setLoading(false);
      }), query.trim() ? 250 : 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [district, query]);

  const districts = useMemo(
    () => ["All districts", ...new Set(colleges.map((college) => college.district).filter(Boolean))],
    [colleges]
  );

  const filteredColleges = colleges;

  const openDetails = async (college) => {
    setSelectedCollege(college);
    const recent = JSON.parse(localStorage.getItem("vm_recent_colleges") || "[]");
    const updatedRecent = [college, ...recent.filter((item) => item._id !== college._id)].slice(0, 4);
    localStorage.setItem("vm_recent_colleges", JSON.stringify(updatedRecent));
    setDetailsLoading(true);
    try {
      const response = await getCollegeByIdAPI(college._id);
      setSelectedCollege(response.college);
    } catch (requestError) {
      setError(requestError.message || "Unable to load college details");
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">Explore education</p>
          <h1 className="text-2xl font-extrabold text-white mt-1">Find your next college</h1>
          <p className="text-sm text-slate-400 mt-1">Search verified college records from the VidyaMarg database.</p>
        </div>
        <span className="text-xs text-slate-400">{filteredColleges.length} of {colleges.length} colleges</span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-5 shadow-xl">
        <div className="flex flex-col md:flex-row gap-3">
          <label className="relative flex-1">
            <span className="sr-only">Search colleges</span>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search college, district, state, course..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-10 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white" aria-label="Clear search">x</button>
            )}
          </label>
          <select
            value={district}
            onChange={(event) => setDistrict(event.target.value)}
            className="md:w-52 bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            {districts.map((value) => <option key={value}>{value}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-sm text-rose-300">{error}</div>}
      {loading && <LoadingState label="Loading colleges from the database..." />}
      {!loading && !error && filteredColleges.length === 0 && (
        <EmptyState title="No colleges found" message="Try a different college name, district, or course." />
      )}

      {!loading && filteredColleges.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredColleges.map((college) => (
            <article key={college._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg hover:border-blue-500/40 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-blue-400">{college.code || "College record"}</p>
                  <h2 className="text-base font-bold text-white mt-1">{college.name}</h2>
                  <p className="text-xs text-slate-400 mt-1">{[college.district, college.state].filter(Boolean).join(", ")}</p>
                </div>
                {college.isVerified && <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Verified</span>}
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {(college.streamsOffered || []).slice(0, 4).map((stream) => <span key={stream} className="text-[10px] px-2 py-1 rounded-lg bg-slate-800 text-slate-300">{stream}</span>)}
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                <Stat label="Fees / year" value={college.feesPerYear ? `Rs ${college.feesPerYear.toLocaleString("en-IN")}` : "Not listed"} />
                <Stat label="Cutoff" value={college.minCutoffPercentage ? `${college.minCutoffPercentage}%` : "Not listed"} />
                <Stat label="Seats" value={college.seatsAvailable || "Not listed"} />
              </div>
              <button onClick={() => openDetails(college)} className="w-full mt-4 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors">View college details</button>
            </article>
          ))}
        </div>
      )}

      {selectedCollege && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="College details">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-blue-400">College profile</p>
                <h2 className="text-2xl font-extrabold text-white mt-1">{selectedCollege.name}</h2>
                <p className="text-sm text-slate-400 mt-1">{[selectedCollege.district, selectedCollege.state].filter(Boolean).join(", ")}</p>
              </div>
              <button onClick={() => setSelectedCollege(null)} className="text-slate-400 hover:text-white text-xl" aria-label="Close college details">x</button>
            </div>
            <div className="p-6 space-y-6">
              {detailsLoading ? <LoadingState label="Loading complete college profile..." /> : <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Detail label="Accreditation" value={selectedCollege.accreditation} />
                  <Detail label="Fees per year" value={selectedCollege.feesPerYear ? `Rs ${selectedCollege.feesPerYear.toLocaleString("en-IN")}` : null} />
                  <Detail label="Admission deadline" value={selectedCollege.admissionDeadline ? new Date(selectedCollege.admissionDeadline).toLocaleDateString("en-IN") : null} />
                  <Detail label="Contact" value={selectedCollege.contactNumber} />
                </div>
                {selectedCollege.address && <InfoBlock title="Address" value={selectedCollege.address} />}
                {selectedCollege.streamsOffered?.length > 0 && <ListBlock title="Streams offered" items={selectedCollege.streamsOffered} />}
                {selectedCollege.departments?.length > 0 && <ListBlock title="Departments and courses" items={selectedCollege.departments.map((department) => `${department.name}${department.courses?.length ? `: ${department.courses.join(", ")}` : ""}`)} />}
                {selectedCollege.categoryQuota?.length > 0 && <ListBlock title="Category quota" items={selectedCollege.categoryQuota} />}
                <div className="flex flex-wrap gap-3">
                  {selectedCollege.website && <a href={selectedCollege.website} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">Visit website</a>}
                  <button onClick={() => setSelectedCollege(null)} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold">Close</button>
                </div>
              </>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value }) {
  return <div className="bg-slate-950/70 rounded-xl p-3"><p className="text-[10px] text-slate-500">{label}</p><p className="text-xs font-semibold text-white mt-1 truncate">{value}</p></div>;
}

function Detail({ label, value }) {
  return <div className="bg-slate-950/70 rounded-xl p-3"><p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p><p className="text-xs text-white mt-1">{value || "Not listed"}</p></div>;
}

function InfoBlock({ title, value }) {
  return <div><h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">{title}</h3><p className="text-sm text-slate-300 mt-2">{value}</p></div>;
}

function ListBlock({ title, items }) {
  return <div><h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">{title}</h3><div className="flex flex-wrap gap-2 mt-2">{items.map((item) => <span key={item} className="text-xs text-slate-300 bg-slate-800 rounded-lg px-3 py-2">{item}</span>)}</div></div>;
}

function LoadingState({ label }) {
  return <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" /><p className="text-xs text-slate-400 mt-3">{label}</p></div>;
}

function EmptyState({ title, message }) {
  return <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center"><div className="text-3xl">⌂</div><h2 className="text-base font-bold text-white mt-3">{title}</h2><p className="text-xs text-slate-400 mt-1">{message}</p></div>;
}

export default StudentColleges;
