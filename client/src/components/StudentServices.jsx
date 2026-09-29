import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    ArrowRight,
    MapPin,
    CalendarDays,
    IndianRupee,
    Clock3,
    Building2,
    BookOpen,
    CheckCircle2,
    X,
} from "lucide-react";

import { SERVICE_DATA } from "../data/studentServicesData";

function StudentServices({ studentId }) {
    const navigate = useNavigate();

    const [activeService, setActiveService] = useState(null);
    const [search, setSearch] = useState("");

    const currentService = SERVICE_DATA.find(
        (service) => service.id === activeService
    );

    const filteredData = useMemo(() => {
        if (!currentService) return [];

        const query = search.toLowerCase().trim();

        if (!query) return currentService.data;

        return currentService.data.filter((item) =>
            Object.values(item).some((value) =>
                String(value).toLowerCase().includes(query)
            )
        );
    }, [currentService, search]);

    const openService = (serviceId) => {
        setActiveService(serviceId);
        setSearch("");

        setTimeout(() => {
            document
                .getElementById("service-data")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    };

    return (
        <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            {/* Header */}
            <div className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                    Student Services
                </p>

                <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                            Explore Your Opportunities
                        </h2>

                        <p className="mt-1 max-w-2xl text-sm text-slate-500">
                            Find colleges, scholarships, jobs, courses, exams and everything
                            you need for your education and career journey.
                        </p>
                    </div>

                    <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
                        {SERVICE_DATA.length} Services
                    </div>
                </div>
            </div>

            {/* Service Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SERVICE_DATA.map((service) => {
                    const isActive = activeService === service.id;

                    return (
                        <button
                            key={service.id}
                            onClick={() => openService(service.id)}
                            className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition duration-300 hover:-translate-y-1 hover:shadow-lg ${isActive
                                    ? "border-teal-300 bg-teal-50 shadow-md"
                                    : "border-slate-200 bg-white hover:border-teal-200"
                                }`}
                        >
                            <div
                                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${service.iconBg}`}
                            >
                                {service.icon}
                            </div>

                            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-teal-700">
                                {service.title}
                            </h3>

                            <p className="mt-1 min-h-[40px] text-xs leading-5 text-slate-500">
                                {service.description}
                            </p>

                            <div className="mt-5 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400">
                                    {service.data.length} items
                                </span>

                                <span className="flex items-center gap-1 text-xs font-bold text-teal-600">
                                    Explore
                                    <ArrowRight
                                        size={14}
                                        className="transition group-hover:translate-x-1"
                                    />
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Data Section */}
            {currentService && (
                <div
                    id="service-data"
                    className="mt-8 scroll-mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6"
                >
                    {/* Data Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${currentService.iconBg}`}
                            >
                                {currentService.icon}
                            </div>

                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900">
                                    {currentService.title}
                                </h3>

                                <p className="text-xs text-slate-500">
                                    {filteredData.length} results found
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setActiveService(null);
                                setSearch("");
                            }}
                            className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:text-red-500"
                            title="Close"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative mt-5">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={`Search ${currentService.title.toLowerCase()}...`}
                            className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
                        />
                    </div>

                    {/* Results */}
                    <div className="mt-5 space-y-3">
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <ServiceDataCard
                                    key={item.id || index}
                                    item={item}
                                    type={currentService.id}
                                />
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                                <Search
                                    size={28}
                                    className="mx-auto text-slate-300"
                                />

                                <h4 className="mt-3 font-bold text-slate-700">
                                    No results found
                                </h4>

                                <p className="mt-1 text-xs text-slate-400">
                                    Try another search keyword.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}

function ServiceDataCard({ item, type }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-teal-200 hover:shadow-md sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h4 className="text-sm font-extrabold text-slate-900 sm:text-base">
                        {item.title || item.name}
                    </h4>

                    {item.subtitle && (
                        <p className="mt-1 text-xs text-slate-500">
                            {item.subtitle}
                        </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                        {item.location && (
                            <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                                <MapPin size={12} />
                                {item.location}
                            </span>
                        )}

                        {item.date && (
                            <span className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-600">
                                <CalendarDays size={12} />
                                {item.date}
                            </span>
                        )}

                        {item.amount && (
                            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-600">
                                <IndianRupee size={12} />
                                {item.amount}
                            </span>
                        )}

                        {item.duration && (
                            <span className="flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-600">
                                <Clock3 size={12} />
                                {item.duration}
                            </span>
                        )}
                    </div>
                </div>

                {item.status && (
                    <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${item.status === "Open" ||
                                item.status === "Eligible" ||
                                item.status === "Upcoming"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                    >
                        {item.status}
                    </span>
                )}
            </div>

            {item.description && (
                <p className="mt-3 text-xs leading-5 text-slate-500">
                    {item.description}
                </p>
            )}

            {type === "progress" && (
                <div className="mt-4">
                    <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">Progress</span>
                        <span className="text-teal-600">{item.progress}%</span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-teal-500"
                            style={{ width: `${item.progress}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentServices;