import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { registerStudentAPI } from "../api/studentApi";

const STEPS = ["Personal Info", "Academic Info", "Family Contacts", "Review"];

function StudentRegistrationForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
    village: "",
    district: "",
    state: "",
    category: "",
    currentClass: "",
    stream: "Not Applicable",
    interestedField: "",
  });

  const [contacts, setContacts] = useState([
    { relation: "", name: "", phoneNumber: "", isPrimary: true },
  ]);

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  const addContact = () => {
    if (contacts.length < 6) {
      setContacts([...contacts, { relation: "", name: "", phoneNumber: "", isPrimary: false }]);
    }
  };

  const removeContact = (index) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((_, i) => i !== index));
    }
  };

  // Validate only the fields relevant to the current step
  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 0) {
      if (!formData.name.trim()) newErrors.name = "Required";
      if (!formData.village.trim()) newErrors.village = "Required";
      if (!formData.district.trim()) newErrors.district = "Required";
      if (!formData.state) newErrors.state = "Required";
    }

    if (currentStep === 1) {
      if (!formData.category) newErrors.category = "Required";
      if (!formData.currentClass.trim()) newErrors.currentClass = "Required";
    }

    if (currentStep === 2) {
      contacts.forEach((contact, index) => {
        if (!contact.name.trim() || !contact.phoneNumber.trim() || !contact.relation) {
          newErrors[`contact-${index}`] = "All fields required";
        } else if (!/^\d{10}$/.test(contact.phoneNumber)) {
          newErrors[`contact-${index}`] = "Invalid 10-digit number";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setServerError("");
    try {
      const data = await registerStudentAPI({ ...formData, contacts });
      localStorage.setItem("studentId", data.student._id);
      navigate(`/profile/${data.student._id}`);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <p className="text-2xl text-green-700 font-semibold">
          ✅ {t("registration.successMessage")}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 py-8 px-4">
      <div className="max-w-xl mx-auto">

        {/* Teacher Login Link */}
        <div className="flex justify-between mb-4">
          <button
            onClick={() => navigate("/teacher/login")}
            className="text-xs text-gray-400 hover:text-orange-600 transition"
          >
            👨‍🏫 Teacher Login
          </button>
          <button
            onClick={() => navigate("/company/login")}
            className="text-xs text-gray-400 hover:text-blue-600 transition"
          >
            🏢 Company Login
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* Step Progress Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-5">
            <h1 className="text-white font-bold text-lg mb-3">
              {t("registration.title")}
            </h1>
            <div className="flex items-center gap-2">
              {STEPS.map((label, index) => (
                <div key={label} className="flex items-center flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition ${
                      index < step
                        ? "bg-white text-orange-600"
                        : index === step
                        ? "bg-white text-orange-600 ring-4 ring-orange-300"
                        : "bg-orange-400 text-white"
                    }`}
                  >
                    {index < step ? "✓" : index + 1}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-1 rounded ${
                        index < step ? "bg-white" : "bg-orange-400"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-orange-100 text-xs mt-2">
              Step {step + 1} of {STEPS.length}: {STEPS[step]}
            </p>
          </div>

          <div className="p-6">

            {/* STEP 0 — Personal Info */}
            {step === 0 && (
              <div className="space-y-4">
                <FormField label={t("registration.name")} error={errors.name}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label={t("registration.gender")}>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                      <option value="">{t("registration.selectOption")}</option>
                      <option value="Male">{t("registration.male")}</option>
                      <option value="Female">{t("registration.female")}</option>
                      <option value="Other">{t("registration.other")}</option>
                    </select>
                  </FormField>

                  <FormField label={t("registration.dob")}>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="input-field" />
                  </FormField>
                </div>

                <FormField label={t("registration.village")} error={errors.village}>
                  <input type="text" name="village" value={formData.village} onChange={handleChange} className="input-field" />
                </FormField>

                <FormField label={t("registration.district")} error={errors.district}>
                  <input type="text" name="district" value={formData.district} onChange={handleChange} className="input-field" />
                </FormField>

                <FormField label={t("registration.state")} error={errors.state}>
                  <select name="state" value={formData.state} onChange={handleChange} className="input-field">
                    <option value="">{t("registration.stateSelect")}</option>
                    <option value="Madhya Pradesh">{t("registration.mp")}</option>
                    <option value="Uttar Pradesh">{t("registration.up")}</option>
                    <option value="Rajasthan">{t("registration.rajasthan")}</option>
                    <option value="Gujarat">{t("registration.gujarat")}</option>
                    <option value="Maharashtra">{t("registration.maharashtra")}</option>
                    <option value="Bihar">{t("registration.bihar")}</option>
                    <option value="Chhattisgarh">{t("registration.chhattisgarh")}</option>
                    <option value="Delhi">{t("registration.delhi")}</option>
                  </select>
                </FormField>
              </div>
            )}

            {/* STEP 1 — Academic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <FormField label={t("registration.category")} error={errors.category}>
                  <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                    <option value="">{t("registration.selectOption")}</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </FormField>

                <FormField label={t("registration.currentClass")} error={errors.currentClass}>
                  <input
                    type="text"
                    name="currentClass"
                    placeholder="e.g. 10th, 12th, B.A. 1st Year"
                    value={formData.currentClass}
                    onChange={handleChange}
                    className="input-field"
                  />
                </FormField>

                <FormField label={t("registration.stream")}>
                  <select name="stream" value={formData.stream} onChange={handleChange} className="input-field">
                    <option value="Not Applicable">{t("registration.notApplicable")}</option>
                    <option value="Science">{t("registration.science")}</option>
                    <option value="Commerce">{t("registration.commerce")}</option>
                    <option value="Arts">{t("registration.arts")}</option>
                  </select>
                </FormField>

                <FormField label={t("registration.interestedField")}>
                  <input
                    type="text"
                    name="interestedField"
                    value={formData.interestedField}
                    onChange={handleChange}
                    className="input-field"
                  />
                </FormField>
              </div>
            )}

            {/* STEP 2 — Family Contacts */}
            {step === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 mb-2">
                  {t("registration.familyContacts")} — add up to 6 people who can be reached
                </p>

                {contacts.map((contact, index) => (
                  <div key={index} className="border rounded-xl p-4 bg-orange-50">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <select
                        value={contact.relation}
                        onChange={(e) => handleContactChange(index, "relation", e.target.value)}
                        className="input-field text-sm"
                      >
                        <option value="">{t("registration.selectOption")}</option>
                        <option value="Father">{t("registration.father")}</option>
                        <option value="Mother">{t("registration.mother")}</option>
                        <option value="Brother">{t("registration.brother")}</option>
                        <option value="Sister">{t("registration.sister")}</option>
                        <option value="Uncle">{t("registration.uncle")}</option>
                        <option value="Teacher">{t("registration.teacher")}</option>
                        <option value="Neighbour">{t("registration.neighbour")}</option>
                      </select>
                      <input
                        type="text"
                        placeholder={t("registration.contactName")}
                        value={contact.name}
                        onChange={(e) => handleContactChange(index, "name", e.target.value)}
                        className="input-field text-sm"
                      />
                    </div>
                    <input
                      type="tel"
                      placeholder={t("registration.phoneNumber")}
                      value={contact.phoneNumber}
                      onChange={(e) => handleContactChange(index, "phoneNumber", e.target.value)}
                      maxLength={10}
                      className="input-field text-sm mb-2"
                    />
                    <div className="flex justify-between items-center">
                      <label className="flex items-center gap-2 text-xs text-gray-600">
                        <input
                          type="checkbox"
                          checked={contact.isPrimary}
                          onChange={(e) => handleContactChange(index, "isPrimary", e.target.checked)}
                        />
                        {t("registration.primaryContact")}
                      </label>
                      {contacts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeContact(index)}
                          className="text-xs text-red-500 underline"
                        >
                          {t("registration.removeContact")}
                        </button>
                      )}
                    </div>
                    {errors[`contact-${index}`] && (
                      <p className="text-red-600 text-xs mt-2">{errors[`contact-${index}`]}</p>
                    )}
                  </div>
                ))}

                {contacts.length < 6 && (
                  <button
                    type="button"
                    onClick={addContact}
                    className="w-full text-orange-700 font-medium py-2 border-2 border-dashed border-orange-300 rounded-lg text-sm hover:bg-orange-50"
                  >
                    + {t("registration.addContact")}
                  </button>
                )}
              </div>
            )}

            {/* STEP 3 — Review */}
            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 mb-2">
                  Please review your details before submitting
                </p>

                <ReviewSection title="Personal Info">
                  <ReviewRow label="Name" value={formData.name} />
                  <ReviewRow label="Village" value={formData.village} />
                  <ReviewRow label="District" value={formData.district} />
                  <ReviewRow label="State" value={formData.state} />
                </ReviewSection>

                <ReviewSection title="Academic Info">
                  <ReviewRow label="Category" value={formData.category} />
                  <ReviewRow label="Class" value={formData.currentClass} />
                  <ReviewRow label="Stream" value={formData.stream} />
                </ReviewSection>

                <ReviewSection title="Family Contacts">
                  {contacts.map((c, i) => (
                    <ReviewRow
                      key={i}
                      label={c.relation || `Contact ${i + 1}`}
                      value={`${c.name} — ${c.phoneNumber}`}
                    />
                  ))}
                </ReviewSection>

                {serverError && (
                  <p className="text-red-600 text-sm text-center">{serverError}</p>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
              )}

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "✅ Submit Registration"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable form field wrapper
function FormField({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700">{label}</label>
      {children}
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}

// Review section wrapper
function ReviewSection({ title, children }) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800 font-medium">{value || "—"}</span>
    </div>
  );
}

export default StudentRegistrationForm;