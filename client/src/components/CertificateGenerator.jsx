import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import {
  getStudentCertificatesAPI,
  issueCertificateAPI,
} from "../api/studentApi";

const CERT_TYPES = [
  { key: "ClassTopper", label: "🏆 Class Topper", color: "#f97316" },
  { key: "MostImproved", label: "📈 Most Improved", color: "#3b82f6" },
  { key: "ConsistentLearner", label: "🔥 Consistent Learner", color: "#10b981" },
  { key: "FirstGraduate", label: "🎓 First Graduate", color: "#8b5cf6" },
  { key: "ActivityChampion", label: "⚡ Activity Champion", color: "#f59e0b" },
  { key: "Participation", label: "🌟 Participation", color: "#6366f1" },
];

function CertificateGenerator({ studentId, studentName, studentVillage, studentDistrict }) {
  const { t } = useTranslation();
  const { token } = useAuth();
  const certificateRef = useRef(null);

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [issueForm, setIssueForm] = useState({
    type: "ClassTopper",
    title: "",
    description: "",
    academicYear: "2023-2024",
  });

  useEffect(() => {
    fetchCertificates();
  }, [studentId]);

  const fetchCertificates = async () => {
    try {
      const data = await getStudentCertificatesAPI(studentId);
      setCertificates(data.certificates);
      if (data.certificates.length > 0) {
        setSelectedCert(data.certificates[0]);
      }
    } catch (err) {
      console.error("Failed to load certificates:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueCertificate = async (e) => {
    e.preventDefault();
    setIssuing(true);
    try {
      await issueCertificateAPI(
        { studentId, ...issueForm },
        token
      );
      setSuccessMessage("✅ Certificate issued successfully!");
      setShowIssueForm(false);
      fetchCertificates();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setSuccessMessage("❌ Failed: " + err.message);
    } finally {
      setIssuing(false);
    }
  };

  const getCertTypeInfo = (type) => {
    return CERT_TYPES.find((c) => c.key === type) || CERT_TYPES[0];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Download certificate as image using Canvas API
  const downloadCertificate = () => {
    if (!selectedCert) return;

    const certInfo = getCertTypeInfo(selectedCert.type);
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#fffbf5";
    ctx.fillRect(0, 0, 1200, 850);

    // Border
    ctx.strokeStyle = certInfo.color;
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, 1160, 810);

    // Inner border
    ctx.strokeStyle = certInfo.color + "44";
    ctx.lineWidth = 3;
    ctx.strokeRect(35, 35, 1130, 780);

    // Header background
    ctx.fillStyle = certInfo.color;
    ctx.fillRect(20, 20, 1160, 120);

    // App name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.fillText("VidyaMarg", 600, 65);

    // Subtitle
    ctx.font = "18px Arial";
    ctx.fillText("Empowering Village Students", 600, 100);

    // Certificate of Achievement text
    ctx.fillStyle = certInfo.color;
    ctx.font = "bold 22px Arial";
    ctx.fillText("CERTIFICATE OF ACHIEVEMENT", 600, 195);

    // Decorative line
    ctx.strokeStyle = certInfo.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 215);
    ctx.lineTo(1000, 215);
    ctx.stroke();

    // "This is to certify that"
    ctx.fillStyle = "#6b7280";
    ctx.font = "20px Arial";
    ctx.fillText("This is to certify that", 600, 270);

    // Student Name
    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 52px Arial";
    ctx.fillText(studentName, 600, 355);

    // Underline name
    const nameWidth = ctx.measureText(studentName).width;
    ctx.strokeStyle = certInfo.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(600 - nameWidth / 2, 370);
    ctx.lineTo(600 + nameWidth / 2, 370);
    ctx.stroke();

    // Village/District
    ctx.fillStyle = "#6b7280";
    ctx.font = "18px Arial";
    ctx.fillText(
      `${studentVillage}, ${studentDistrict}`,
      600,
      410
    );

    // "has been awarded"
    ctx.fillStyle = "#374151";
    ctx.font = "20px Arial";
    ctx.fillText("has been awarded the", 600, 460);

    // Certificate Title
    ctx.fillStyle = certInfo.color;
    ctx.font = "bold 38px Arial";
    ctx.fillText(selectedCert.title, 600, 520);

    // Description
    if (selectedCert.description) {
      ctx.fillStyle = "#6b7280";
      ctx.font = "16px Arial";
      // Word wrap description
      const words = selectedCert.description.split(" ");
      let line = "";
      let y = 570;
      for (const word of words) {
        const testLine = line + word + " ";
        if (ctx.measureText(testLine).width > 800 && line !== "") {
          ctx.fillText(line, 600, y);
          line = word + " ";
          y += 25;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 600, y);
    }

    // Certificate Number
    ctx.fillStyle = "#9ca3af";
    ctx.font = "14px Arial";
    ctx.fillText(
      `Certificate No: ${selectedCert.certificateNumber}`,
      600,
      680
    );

    // Date
    ctx.fillText(`Issued on: ${formatDate(selectedCert.createdAt)}`, 600, 705);

    // Academic Year
    if (selectedCert.academicYear) {
      ctx.fillText(
        `Academic Year: ${selectedCert.academicYear}`,
        600,
        730
      );
    }

    // Bottom decorative line
    ctx.strokeStyle = certInfo.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 755);
    ctx.lineTo(1000, 755);
    ctx.stroke();

    // Footer
    ctx.fillStyle = certInfo.color;
    ctx.font = "bold 16px Arial";
    ctx.fillText("VidyaMarg — Gaon se College Tak", 600, 790);

    // Download
    const link = document.createElement("a");
    link.download = `${studentName}_${selectedCert.type}_Certificate.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Share on WhatsApp
  const shareOnWhatsApp = () => {
    if (!selectedCert) return;
    const message = encodeURIComponent(
      `🎓 *VidyaMarg Certificate*\n\n` +
      `*${studentName}* has been awarded:\n` +
      `🏆 *${selectedCert.title}*\n\n` +
      `📍 ${studentVillage}, ${studentDistrict}\n` +
      `📜 Certificate No: ${selectedCert.certificateNumber}\n\n` +
      `_Powered by VidyaMarg — Gaon se College Tak_`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4">

      {/* Header */}
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-orange-700">
            🏅 Certificates
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {certificates.length} certificate(s) earned
          </p>
        </div>
        {token && (
          <button
            onClick={() => setShowIssueForm(!showIssueForm)}
            className="text-sm bg-orange-600 text-white px-3 py-2 rounded hover:bg-orange-700 transition"
          >
            + Issue Certificate
          </button>
        )}
      </div>

      <div className="p-6">

        {/* Success Message */}
        {successMessage && (
          <p className="text-sm px-3 py-2 rounded mb-4 bg-green-50 text-green-700">
            {successMessage}
          </p>
        )}

        {/* Issue Certificate Form */}
        {showIssueForm && token && (
          <form
            onSubmit={handleIssueCertificate}
            className="bg-orange-50 rounded-lg p-4 mb-6 border border-orange-200"
          >
            <h3 className="font-medium text-gray-700 mb-3">
              Issue New Certificate
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Certificate Type
                </label>
                <select
                  value={issueForm.type}
                  onChange={(e) =>
                    setIssueForm((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  {CERT_TYPES.map((type) => (
                    <option key={type.key} value={type.key}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={issueForm.academicYear}
                  onChange={(e) =>
                    setIssueForm((prev) => ({
                      ...prev,
                      academicYear: e.target.value,
                    }))
                  }
                  placeholder="e.g. 2023-2024"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Certificate Title
              </label>
              <input
                type="text"
                value={issueForm.title}
                onChange={(e) =>
                  setIssueForm((prev) => ({ ...prev, title: e.target.value }))
                }
                required
                placeholder="e.g. Class 12th Topper 2024"
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Description
              </label>
              <textarea
                value={issueForm.description}
                onChange={(e) =>
                  setIssueForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="e.g. Achieved highest marks of 85% in Class 12th"
                rows={2}
                className="w-full border rounded px-3 py-2 text-sm resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={issuing}
                className="bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700 transition disabled:opacity-50"
              >
                {issuing ? "Issuing..." : "Issue Certificate"}
              </button>
              <button
                type="button"
                onClick={() => setShowIssueForm(false)}
                className="border text-gray-500 px-4 py-2 rounded text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Certificate List */}
        {loading ? (
          <p className="text-gray-400 text-sm">Loading certificates...</p>
        ) : certificates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">🏅</p>
            <p className="text-gray-400 text-sm">No certificates yet</p>
            {token && (
              <p className="text-gray-300 text-xs mt-1">
                Issue a certificate using the button above
              </p>
            )}
          </div>
        ) : (
          <div>
            {/* Certificate Selector */}
            <div className="flex gap-2 flex-wrap mb-6">
              {certificates.map((cert) => {
                const certInfo = getCertTypeInfo(cert.type);
                return (
                  <button
                    key={cert._id}
                    onClick={() => setSelectedCert(cert)}
                    className={`text-sm px-3 py-2 rounded-lg transition border ${
                      selectedCert?._id === cert._id
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-200 text-gray-600 hover:border-orange-300"
                    }`}
                  >
                    {certInfo.label}
                  </button>
                );
              })}
            </div>

            {/* Certificate Preview */}
            {selectedCert && (
              <div>
                <CertificatePreview
                  certificate={selectedCert}
                  studentName={studentName}
                  studentVillage={studentVillage}
                  studentDistrict={studentDistrict}
                  certInfo={getCertTypeInfo(selectedCert.type)}
                  formatDate={formatDate}
                />

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={downloadCertificate}
                    className="flex-1 bg-orange-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-orange-700 transition"
                  >
                    ⬇️ Download Certificate
                  </button>
                  <button
                    onClick={shareOnWhatsApp}
                    className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                  >
                    📱 Share on WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Certificate Preview Component
function CertificatePreview({
  certificate,
  studentName,
  studentVillage,
  studentDistrict,
  certInfo,
  formatDate,
}) {
  return (
    <div
      className="border-4 rounded-lg overflow-hidden"
      style={{ borderColor: certInfo.color }}
    >
      {/* Certificate Header */}
      <div
        className="px-8 py-4 text-center text-white"
        style={{ backgroundColor: certInfo.color }}
      >
        <p className="text-xl font-bold">VidyaMarg</p>
        <p className="text-sm opacity-80">Empowering Village Students</p>
      </div>

      {/* Certificate Body */}
      <div className="px-8 py-6 bg-orange-50 text-center">
        <p
          className="text-sm font-semibold uppercase tracking-widest mb-4"
          style={{ color: certInfo.color }}
        >
          Certificate of Achievement
        </p>

        <p className="text-gray-500 text-sm mb-2">This is to certify that</p>

        <p className="text-3xl font-bold text-gray-800 mb-1">{studentName}</p>

        <p
          className="text-sm mb-4"
          style={{
            borderBottom: `2px solid ${certInfo.color}`,
            paddingBottom: "8px",
            display: "inline-block",
          }}
        >
          {studentVillage}, {studentDistrict}
        </p>

        <p className="text-gray-500 text-sm mb-2">has been awarded the</p>

        <p
          className="text-2xl font-bold mb-3"
          style={{ color: certInfo.color }}
        >
          {certificate.title}
        </p>

        {certificate.description && (
          <p className="text-gray-500 text-sm mb-4 max-w-md mx-auto">
            {certificate.description}
          </p>
        )}

        <div className="flex justify-center gap-8 text-xs text-gray-400 mt-4 pt-4 border-t">
          <span>📜 {certificate.certificateNumber}</span>
          <span>📅 {formatDate(certificate.createdAt)}</span>
          {certificate.academicYear && (
            <span>🎓 {certificate.academicYear}</span>
          )}
        </div>
      </div>

      {/* Certificate Footer */}
      <div
        className="px-8 py-3 text-center text-white text-xs"
        style={{ backgroundColor: certInfo.color }}
      >
        VidyaMarg — Gaon se College Tak
      </div>
    </div>
  );
}

export default CertificateGenerator;