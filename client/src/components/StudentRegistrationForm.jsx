import { useState } from "react";
import { useTranslation } from "react-i18next";

function StudentRegistrationForm() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
    village: "",
    district: "",
    state: "Madhya Pradesh",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value;
    setContacts(updatedContacts);
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

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t("registration.required");
    if (!formData.village.trim()) newErrors.village = t("registration.required");
    if (!formData.district.trim()) newErrors.district = t("registration.required");
    if (!formData.category) newErrors.category = t("registration.required");
    if (!formData.currentClass.trim()) newErrors.currentClass = t("registration.required");

    contacts.forEach((contact, index) => {
      if (!contact.name.trim() || !contact.phoneNumber.trim() || !contact.relation) {
        newErrors[`contact-${index}`] = t("registration.required");
      } else if (!/^\d{10}$/.test(contact.phoneNumber)) {
        newErrors[`contact-${index}`] = t("registration.invalidPhone");
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Data:", formData);
      console.log("Contacts:", contacts);
      setSubmitted(true);
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
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-orange-700 mb-6">
          {t("registration.title")}
        </h1>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{t("registration.name")}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{t("registration.gender")}</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">{t("registration.selectOption")}</option>
            <option value="Male">{t("registration.male")}</option>
            <option value="Female">{t("registration.female")}</option>
            <option value="Other">{t("registration.other")}</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{t("registration.dob")}</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{t("registration.village")}</label>
          <input
            type="text"
            name="village"
            value={formData.village}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.village && <p className="text-red-600 text-sm mt-1">{errors.village}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{t("registration.district")}</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.district && <p className="text-red-600 text-sm mt-1">{errors.district}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{t("registration.category")}</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">{t("registration.selectOption")}</option>
            <option value="General">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="EWS">EWS</option>
          </select>
          {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{t("registration.currentClass")}</label>
          <input
            type="text"
            name="currentClass"
            placeholder="e.g. 10th, 12th, B.A. 1st Year"
            value={formData.currentClass}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.currentClass && <p className="text-red-600 text-sm mt-1">{errors.currentClass}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{t("registration.stream")}</label>
          <select
            name="stream"
            value={formData.stream}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Not Applicable">{t("registration.notApplicable")}</option>
            <option value="Science">{t("registration.science")}</option>
            <option value="Commerce">{t("registration.commerce")}</option>
            <option value="Arts">{t("registration.arts")}</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">{t("registration.interestedField")}</label>
          <input
            type="text"
            name="interestedField"
            value={formData.interestedField}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <hr className="my-6" />

        <h2 className="text-lg font-semibold mb-4">{t("registration.familyContacts")}</h2>

        {contacts.map((contact, index) => (
          <div key={index} className="border rounded p-4 mb-4 bg-orange-50">
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">{t("registration.relation")}</label>
              <select
                value={contact.relation}
                onChange={(e) => handleContactChange(index, "relation", e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">{t("registration.selectOption")}</option>
                <option value="Father">{t("registration.father")}</option>
                <option value="Mother">{t("registration.mother")}</option>
                <option value="Brother">{t("registration.brother")}</option>
                <option value="Sister">{t("registration.sister")}</option>
                <option value="Uncle">{t("registration.uncle")}</option>
                <option value="Teacher">{t("registration.teacher")}</option>
                <option value="Neighbour">{t("registration.neighbour")}</option>
                <option value="Other">{t("registration.other_relation")}</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">{t("registration.contactName")}</label>
              <input
                type="text"
                value={contact.name}
                onChange={(e) => handleContactChange(index, "name", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">{t("registration.phoneNumber")}</label>
              <input
                type="tel"
                value={contact.phoneNumber}
                onChange={(e) => handleContactChange(index, "phoneNumber", e.target.value)}
                className="w-full border rounded px-3 py-2"
                maxLength={10}
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={contact.isPrimary}
                onChange={(e) => handleContactChange(index, "isPrimary", e.target.checked)}
              />
              {t("registration.primaryContact")}
            </label>

            {errors[`contact-${index}`] && (
              <p className="text-red-600 text-sm mt-1">{errors[`contact-${index}`]}</p>
            )}

            {contacts.length > 1 && (
              <button
                type="button"
                onClick={() => removeContact(index)}
                className="text-red-600 text-sm mt-2 underline"
              >
                {t("registration.removeContact")}
              </button>
            )}
          </div>
        ))}

        {contacts.length < 6 && (
          <button
            type="button"
            onClick={addContact}
            className="text-orange-700 font-medium mb-6 underline"
          >
            + {t("registration.addContact")}
          </button>
        )}

        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition"
        >
          {t("registration.submit")}
        </button>
      </form>
    </div>
  );
}

export default StudentRegistrationForm;