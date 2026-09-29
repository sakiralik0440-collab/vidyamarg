import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getStudentByIdAPI } from "../api/studentApi";
import { saveToCache, getFromCache } from "../utils/localCache";
import { useOfflineDetection } from "../hooks/useOfflineDetection";
import StudentServices from "./StudentServices";

function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isOnline } = useOfflineDetection();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      const cacheKey = `student_${id}`;
      const cachedStudent = getFromCache(cacheKey);

      if (cachedStudent && !navigator.onLine) {
        setStudent(cachedStudent);
        setLoading(false);
        return;
      }

      try {
        const data = await getStudentByIdAPI(id);

        setStudent(data.student);
        saveToCache(cacheKey, data.student);
      } catch (err) {
        if (cachedStudent) {
          setStudent(cachedStudent);
        } else {
          setError(err.message || "Unable to load student profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";

      case "At Risk":
        return "bg-amber-50 text-amber-700 border-amber-100";

      case "Dropout":
        return "bg-red-50 text-red-700 border-red-100";

      case "Placed":
        return "bg-blue-50 text-blue-700 border-blue-100";

      case "Graduated":
        return "bg-purple-50 text-purple-700 border-purple-100";

      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Active":
        return t("profile.active");

      case "At Risk":
        return t("profile.atRisk");

      case "Dropout":
        return t("profile.dropout");

      case "Placed":
        return t("profile.placed");

      case "Graduated":
        return t("profile.graduated");

      default:
        return status || "Active";
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-xl text-red-600">
              !
            </div>

            <h1 className="mt-5 text-xl font-extrabold text-slate-900">
              Profile unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error || t("profile.notFound")}
            </p>

            <button
              onClick={() => navigate("/student/dashboard")}
              className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const score = Math.max(
    0,
    Math.min(100, Number(student.activityScore) || 0)
  );

  const initials =
    student.name
      ?.split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "ST";

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <div>
          <p className="text-sm font-semibold text-teal-600">
            Student Portal
          </p>

          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage your student information.
          </p>
        </div>

        {/* Offline Notice */}
        {!isOnline && (
          <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            <span>📵</span>
            <span>
              Offline mode — showing your latest saved profile.
            </span>
          </div>
        )}

        {/* Profile Hero */}
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="relative overflow-hidden bg-slate-900 px-6 py-7 sm:px-8 sm:py-9">

            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-teal-500/10 blur-2xl" />

            <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-blue-500/10 blur-2xl" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4 sm:gap-5">

                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-teal-600 text-2xl font-extrabold text-white shadow-xl shadow-black/20 sm:h-24 sm:w-24 sm:text-3xl">
                  {initials}
                </div>

                <div className="min-w-0">

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-300">
                    Welcome back
                  </p>

                  <h2 className="mt-1 truncate text-2xl font-extrabold text-white sm:text-3xl">
                    {student.name || "Student"}
                  </h2>

                  <p className="mt-2 text-sm text-slate-300">
                    {[
                      student.currentClass,
                      student.stream,
                      student.district,
                    ]
                      .filter(
                        (value) =>
                          value &&
                          value !== "Not Applicable" &&
                          value !== "N/A"
                      )
                      .join(" • ")}
                  </p>

                </div>
              </div>

              <span
                className={`self-start rounded-full border px-4 py-2 text-xs font-bold ${getStatusColor(
                  student.status
                )}`}
              >
                ● {getStatusLabel(student.status)}
              </span>

            </div>
          </div>

          {/* Activity Score */}
          <div className="border-t border-slate-100 px-6 py-6 sm:px-8">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Activity Score
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  Your overall engagement
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-900">
                  {score}
                </span>

                <span className="text-sm font-semibold text-slate-400">
                  /100
                </span>
              </div>

            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-teal-500 transition-all duration-700"
                style={{ width: `${score}%` }}
              />
            </div>

          </div>
        </section>

        {/* Main Information */}
        <div className="grid gap-6 lg:grid-cols-2">

          <InfoCard
            title="Personal Information"
            icon="👤"
            fields={[
              ["Gender", student.gender],
              ["Category", student.category],
              ["Date of Birth", formatDate(student.dateOfBirth)],
              ["Interested Field", student.interestedField],
            ]}
          />

          <InfoCard
            title="Academic Information"
            icon="🎓"
            fields={[
              ["Current Class", student.currentClass],
              ["Stream", student.stream],
              ["Branch", student.branch],
              ["Semester", student.semester],
            ]}
          />

          <InfoCard
            title="Location"
            icon="📍"
            fields={[
              ["Village", student.village],
              ["District", student.district],
              ["State", student.state],
            ]}
          />

          <InfoCard
            title="Family"
            icon="👨‍👩‍👦"
            fields={[
              [
                "Family Contacts",
                student.familyContacts?.length
                  ? `${student.familyContacts.length} contact${student.familyContacts.length > 1 ? "s" : ""
                  } connected`
                  : "No contacts added",
              ],
            ]}
          />

        </div>

        {/* =====================================================
            NEW STUDENT SERVICES
        ===================================================== */}

        <StudentServices studentId={id} />

      </div>
    </div>
  );
}

/* =========================================================
   INFORMATION CARD
========================================================= */

function InfoCard({ title, icon, fields }) {
  const visibleFields = fields.filter(
    ([, value]) =>
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "Not Applicable"
  );

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-lg">
          {icon}
        </div>

        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            {title}
          </h2>

          <p className="text-xs text-slate-400">
            Student details
          </p>
        </div>

      </div>

      {visibleFields.length ? (
        <div className="grid gap-5 sm:grid-cols-2">

          {visibleFields.map(([label, value]) => (
            <div key={label}>

              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {label}
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {value}
              </p>

            </div>
          ))}

        </div>
      ) : (
        <p className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
          No information available.
        </p>
      )}

    </section>
  );
}

/* =========================================================
   LOADING SKELETON
========================================================= */

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-6xl space-y-6">

        <div className="space-y-2">
          <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-4 w-72 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="h-64 animate-pulse rounded-[28px] bg-white shadow-sm" />

        <div className="grid gap-6 lg:grid-cols-2">

          <div className="h-48 animate-pulse rounded-[28px] bg-white" />

          <div className="h-48 animate-pulse rounded-[28px] bg-white" />

          <div className="h-40 animate-pulse rounded-[28px] bg-white" />

          <div className="h-40 animate-pulse rounded-[28px] bg-white" />

        </div>

        <div className="h-96 animate-pulse rounded-[28px] bg-white" />

      </div>

    </div>
  );
}

/* =========================================================
   DATE FORMATTER
========================================================= */

function formatDate(value) {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN");
}

export default StudentProfile;