import { useState } from "react";
import { useTranslation } from "react-i18next";
import { matchMentorsAPI, registerMentorAPI } from "../api/studentApi";

const STATUS_COLORS = {
  Working: "bg-green-100 text-green-700",
  "College Student": "bg-blue-100 text-blue-700",
  Graduated: "bg-purple-100 text-purple-700",
  "Self-Employed": "bg-orange-100 text-orange-700",
};

function MentorFinder({ student }) {
  const { t } = useTranslation();

  const [mentors, setMentors] = useState([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState("find");

  const [form, setForm] = useState({
    stream: student?.stream || "",
    field: student?.interestedField || "",
    district: student?.district || "",
    state: student?.state || "Madhya Pradesh",
    needGuidanceIn: "",
  });

  const [mentorForm, setMentorForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    village: student?.village || "",
    district: student?.district || "",
    state: student?.state || "Madhya Pradesh",
    currentStatus: "Working",
    currentOrganization: "",
    field: "",
    stream: student?.stream || "",
    highestEducation: "",
    canMentorIn: "",
    languagesSpoken: "Hindi",
    availableDays: "",
    availableTime: "",
    bio: "",
  });

  const [registerMessage, setRegisterMessage] = useState("");
  const [registering, setRegistering] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMentorFormChange = (e) => {
    const { name, value } = e.target;
    setMentorForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setSearched(false);
    try {
      const data = await matchMentorsAPI(form);
      setMentors(data.mentors);
      setSearched(true);
    } catch (err) {
      console.error("Mentor search failed:", err.message);
      setSearched(true);
    } finally {
      setSearching(false);
    }
  };

  const handleRegisterMentor = async (e) => {
    e.preventDefault();
    setRegistering(true);
    setRegisterMessage("");
    try {
      const submitData = {
        ...mentorForm,
        canMentorIn: mentorForm.canMentorIn
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        languagesSpoken: mentorForm.languagesSpoken
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        availableDays: mentorForm.availableDays
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      await registerMentorAPI(submitData);
      setRegisterMessage(
        "✅ Registered successfully! You will be verified by admin soon."
      );
      setMentorForm({
        name: "",
        phone: "",
        whatsapp: "",
        village: "",
        district: "",
        state: "Madhya Pradesh",
        currentStatus: "Working",
        currentOrganization: "",
        field: "",
        stream: "",
        highestEducation: "",
        canMentorIn: "",
        languagesSpoken: "Hindi",
        availableDays: "",
        availableTime: "",
        bio: "",
      });
    } catch (err) {
      setRegisterMessage("❌ Failed: " + err.message);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4">

      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-teal-700">
          🤝 {t("mentor.title")}
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">
          {t("mentor.subtitle")}
        </p>
      </div>

      <div className="p-6">

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { key: "find", label: "🔍 Find Mentor" },
            { key: "become", label: "🤝 Become a Mentor" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab.key
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-teal-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Find Mentor Tab */}
        {activeTab === "find" && (
          <div>
            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="bg-teal-50 rounded-lg p-4 mb-5 border border-teal-100"
            >
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {t("mentor.stream")}
                  </label>
                  <select
                    name="stream"
                    value={form.stream}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="">Any Stream</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {t("mentor.field")}
                  </label>
                  <input
                    type="text"
                    name="field"
                    value={form.field}
                    onChange={handleChange}
                    placeholder="e.g. Engineering, Medical"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {t("mentor.guidanceArea")}
                  </label>
                  <input
                    type="text"
                    name="needGuidanceIn"
                    value={form.needGuidanceIn}
                    onChange={handleChange}
                    placeholder="e.g. College Admission, Scholarship, Career"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={searching}
                className="w-full bg-teal-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 transition disabled:opacity-50"
              >
                {searching ? t("mentor.searching") : t("mentor.findButton")}
              </button>
            </form>

            {/* Results */}
            {searched && (
              <div>
                {mentors.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-4xl mb-3">🤝</p>
                    <p className="text-gray-400">{t("mentor.noResults")}</p>
                    <p className="text-gray-300 text-xs mt-1">
                      {t("mentor.noResultsHint")}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500 mb-4">
                      <span className="font-semibold text-teal-700">
                        {mentors.length}
                      </span>{" "}
                      {t("mentor.results")}
                    </p>

                    <div className="space-y-4">
                      {mentors.map((mentor) => {
                        const isExpanded = expandedId === mentor._id;
                        const statusColor =
                          STATUS_COLORS[mentor.currentStatus] ||
                          "bg-gray-100 text-gray-600";

                        return (
                          <div
                            key={mentor._id}
                            className={`border rounded-lg overflow-hidden transition ${
                              isExpanded
                                ? "border-teal-400 shadow-md"
                                : "border-gray-200"
                            }`}
                          >
                            {/* Mentor Card Header */}
                            <div
                              className="p-4 cursor-pointer hover:bg-teal-50 transition"
                              onClick={() =>
                                setExpandedId(
                                  isExpanded ? null : mentor._id
                                )
                              }
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                  {/* Avatar */}
                                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-lg">
                                    {mentor.name.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-semibold text-gray-800">
                                        {mentor.name}
                                      </p>
                                      {mentor.isVerified && (
                                        <span className="text-xs bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded">
                                          ✓ {t("mentor.verified")}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                      {mentor.currentOrganization ||
                                        mentor.field}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      📍 {mentor.village}, {mentor.district}
                                    </p>
                                  </div>
                                </div>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor}`}
                                >
                                  {mentor.currentStatus}
                                </span>
                              </div>

                              {/* Can mentor in */}
                              {mentor.canMentorIn?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-3">
                                  {mentor.canMentorIn
                                    .slice(0, 3)
                                    .map((area, i) => (
                                      <span
                                        key={i}
                                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                                      >
                                        {area}
                                      </span>
                                    ))}
                                  {mentor.canMentorIn.length > 3 && (
                                    <span className="text-xs text-gray-400">
                                      +{mentor.canMentorIn.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                              <div className="border-t bg-gray-50 p-4 space-y-4">

                                {/* Bio */}
                                {mentor.bio && (
                                  <p className="text-sm text-gray-600 italic">
                                    "{mentor.bio}"
                                  </p>
                                )}

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-xs text-gray-400 uppercase mb-1">
                                      Education
                                    </p>
                                    <p className="font-medium">
                                      {mentor.highestEducation || "—"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400 uppercase mb-1">
                                      {t("mentor.field")}
                                    </p>
                                    <p className="font-medium">{mentor.field}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400 uppercase mb-1">
                                      {t("mentor.days")}
                                    </p>
                                    <p className="text-xs">
                                      {mentor.availableDays?.join(", ") || "—"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400 uppercase mb-1">
                                      {t("mentor.time")}
                                    </p>
                                    <p className="text-xs">
                                      {mentor.availableTime || "—"}
                                    </p>
                                  </div>
                                </div>

                                {/* All guidance areas */}
                                {mentor.canMentorIn?.length > 0 && (
                                  <div>
                                    <p className="text-xs text-gray-400 uppercase mb-2">
                                      {t("mentor.canMentorIn")}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                      {mentor.canMentorIn.map((area, i) => (
                                        <span
                                          key={i}
                                          className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded"
                                        >
                                          {area}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Languages */}
                                {mentor.languagesSpoken?.length > 0 && (
                                  <p className="text-xs text-gray-400">
                                    🗣️ {mentor.languagesSpoken.join(", ")}
                                  </p>
                                )}

                                {/* Contact Buttons */}
                                <div className="flex gap-3">
                                  <a
                                    href={`tel:${mentor.phone}`}
                                    className="flex-1 text-center bg-teal-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 transition"
                                  >
                                    📞 Call
                                  </a>
                                  {mentor.whatsapp && (
                                    <a
                                      href={`https://wa.me/91${mentor.whatsapp}?text=${encodeURIComponent(
                                        `Hello ${mentor.name}! I found you on VidyaMarg. I am a student from ${student?.village || "my village"} and need guidance. Can you help me?`
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-1 text-center bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                                    >
                                      💬 WhatsApp
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Become a Mentor Tab */}
        {activeTab === "become" && (
          <div>
            <div className="bg-teal-50 rounded-lg p-4 mb-5 border border-teal-100">
              <p className="text-sm text-teal-700 font-medium mb-1">
                🤝 {t("mentor.becomeMentor")}
              </p>
              <p className="text-xs text-gray-500">
                {t("mentor.becomeMentorDesc")}
              </p>
            </div>

            {registerMessage && (
              <div
                className={`text-sm px-4 py-3 rounded-lg mb-4 ${
                  registerMessage.startsWith("✅")
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {registerMessage}
              </div>
            )}

            <form onSubmit={handleRegisterMentor} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={mentorForm.name}
                    onChange={handleMentorFormChange}
                    required
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={mentorForm.phone}
                    onChange={handleMentorFormChange}
                    required
                    maxLength={10}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={mentorForm.whatsapp}
                    onChange={handleMentorFormChange}
                    maxLength={10}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Village *
                  </label>
                  <input
                    type="text"
                    name="village"
                    value={mentorForm.village}
                    onChange={handleMentorFormChange}
                    required
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    District *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={mentorForm.district}
                    onChange={handleMentorFormChange}
                    required
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Current Status *
                  </label>
                  <select
                    name="currentStatus"
                    value={mentorForm.currentStatus}
                    onChange={handleMentorFormChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="Working">Working</option>
                    <option value="College Student">College Student</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Self-Employed">Self-Employed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Organization / College
                  </label>
                  <input
                    type="text"
                    name="currentOrganization"
                    value={mentorForm.currentOrganization}
                    onChange={handleMentorFormChange}
                    placeholder="e.g. Infosys, BU Bhopal"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Your Field *
                  </label>
                  <input
                    type="text"
                    name="field"
                    value={mentorForm.field}
                    onChange={handleMentorFormChange}
                    required
                    placeholder="e.g. Engineering, Teaching"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Highest Education
                  </label>
                  <input
                    type="text"
                    name="highestEducation"
                    value={mentorForm.highestEducation}
                    onChange={handleMentorFormChange}
                    placeholder="e.g. B.E., B.Com, ITI"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Stream
                  </label>
                  <select
                    name="stream"
                    value={mentorForm.stream}
                    onChange={handleMentorFormChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="">Select</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Can Mentor In (comma separated)
                  </label>
                  <input
                    type="text"
                    name="canMentorIn"
                    value={mentorForm.canMentorIn}
                    onChange={handleMentorFormChange}
                    placeholder="e.g. College Admission, Scholarship, Career"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Available Days (comma separated)
                  </label>
                  <input
                    type="text"
                    name="availableDays"
                    value={mentorForm.availableDays}
                    onChange={handleMentorFormChange}
                    placeholder="e.g. Saturday, Sunday"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Available Time
                  </label>
                  <input
                    type="text"
                    name="availableTime"
                    value={mentorForm.availableTime}
                    onChange={handleMentorFormChange}
                    placeholder="e.g. 6 PM - 9 PM"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Your Story / Bio
                  </label>
                  <textarea
                    name="bio"
                    value={mentorForm.bio}
                    onChange={handleMentorFormChange}
                    rows={3}
                    placeholder="Share your story — where you came from and how you succeeded..."
                    className="w-full border rounded px-3 py-2 text-sm resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={registering}
                className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition disabled:opacity-50"
              >
                {registering ? "Registering..." : t("mentor.register")}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default MentorFinder;