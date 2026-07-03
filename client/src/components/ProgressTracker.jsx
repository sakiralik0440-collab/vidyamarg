import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { addProgressAPI, getProgressAPI } from "../api/studentApi";

function ProgressTracker({ studentId }) {
  const { t } = useTranslation();

  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const [formData, setFormData] = useState({
    academicYear: "",
    className: "",
    marksPercentage: "",
    result: "Pending",
    attendancePercentage: "",
    remarks: "",
  });

  // Fetch existing records when component loads
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getProgressAPI(studentId);
        setRecords(data.records);
      } catch (err) {
        console.error("Failed to fetch progress records:", err.message);
      } finally {
        setLoadingRecords(false);
      }
    };

    if (studentId) fetchRecords();
  }, [studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setServerError("");

    try {
      const data = await addProgressAPI({
        studentId,
        ...formData,
        marksPercentage: formData.marksPercentage
          ? Number(formData.marksPercentage)
          : undefined,
        attendancePercentage: formData.attendancePercentage
          ? Number(formData.attendancePercentage)
          : undefined,
      });

      // Add the new record to the top of the list
      setRecords((prev) => [...prev, data.progress]);
      setSuccessMessage(t("progress.successMessage"));
      setShowForm(false);
      setFormData({
        academicYear: "",
        className: "",
        marksPercentage: "",
        result: "Pending",
        attendancePercentage: "",
        remarks: "",
      });

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case "Pass": return "text-green-600 bg-green-50";
      case "Fail": return "text-red-600 bg-red-50";
      case "Appearing": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-orange-700">
          {t("progress.title")}
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm bg-orange-600 text-white px-3 py-1.5 rounded hover:bg-orange-700 transition"
        >
          + {t("progress.addRecord")}
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <p className="text-green-700 bg-green-50 text-sm px-3 py-2 rounded mb-4">
          ✅ {successMessage}
        </p>
      )}

      {/* Server Error */}
      {serverError && (
        <p className="text-red-600 bg-red-50 text-sm px-3 py-2 rounded mb-4">
          ❌ {serverError}
        </p>
      )}

      {/* Add Record Form */}
      {showForm && (
        <form
          onSubmit={handleSave}
          className="border rounded-lg p-4 mb-6 bg-orange-50"
        >
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">
                {t("progress.academicYear")}
              </label>
              <input
                type="text"
                name="academicYear"
                placeholder="e.g. 2023-2024"
                value={formData.academicYear}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">
                {t("progress.className")}
              </label>
              <input
                type="text"
                name="className"
                placeholder="e.g. 10th, B.A. 1st Year"
                value={formData.className}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">
                {t("progress.marksPercentage")}
              </label>
              <input
                type="number"
                name="marksPercentage"
                min="0"
                max="100"
                value={formData.marksPercentage}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">
                {t("progress.result")}
              </label>
              <select
                name="result"
                value={formData.result}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="Pass">{t("progress.pass")}</option>
                <option value="Fail">{t("progress.fail")}</option>
                <option value="Appearing">{t("progress.appearing")}</option>
                <option value="Pending">{t("progress.pending")}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">
                {t("progress.attendance")}
              </label>
              <input
                type="number"
                name="attendancePercentage"
                min="0"
                max="100"
                value={formData.attendancePercentage}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">
                {t("progress.remarks")}
              </label>
              <input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700 transition disabled:opacity-50"
            >
              {saving ? t("progress.saving") : t("progress.save")}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-500 text-sm px-4 py-2 rounded border hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Timeline */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
          {t("progress.timeline")}
        </h3>

        {loadingRecords ? (
          <p className="text-gray-400 text-sm">Loading records...</p>
        ) : records.length === 0 ? (
          <p className="text-gray-400 text-sm">{t("progress.noRecords")}</p>
        ) : (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-orange-200" />

            {records.map((record, index) => (
              <div key={record._id || index} className="relative pl-10 pb-6">
                {/* Timeline dot */}
                <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-orange-500 border-2 border-white shadow" />

                <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {record.className}
                      </p>
                      <p className="text-xs text-gray-400">
                        {record.academicYear}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getResultColor(record.result)}`}
                    >
                      {record.result}
                    </span>
                  </div>

                  <div className="flex gap-4 text-sm text-gray-600">
                    {record.marksPercentage !== undefined && (
                      <span>📊 {record.marksPercentage}% marks</span>
                    )}
                    {record.attendancePercentage !== undefined && (
                      <span>📅 {record.attendancePercentage}% attendance</span>
                    )}
                  </div>

                  {record.remarks && (
                    <p className="text-xs text-gray-400 mt-2 italic">
                      {record.remarks}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgressTracker;