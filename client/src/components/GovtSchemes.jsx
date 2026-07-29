import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { matchGovtSchemesAPI } from "../api/studentApi";

const TYPE_COLORS = {
  Scholarship: "bg-green-100 text-green-700",
  "Skill Development": "bg-blue-100 text-blue-700",
  Employment: "bg-purple-100 text-purple-700",
  "Education Loan": "bg-green-100 text-green-800",
  Other: "bg-gray-100 text-gray-600",
};

function GovtSchemes({ student }) {
  const { t } = useTranslation();

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (student) fetchMatchingSchemes();
  }, [student]);

  const fetchMatchingSchemes = async () => {
    try {
      const data = await matchGovtSchemesAPI({
        category: student.category,
        age: 18,
        gender: student.gender || "Male",
        state: student.state,
      });
      setSchemes(data.schemes);
    } catch (err) {
      console.error("Failed to fetch schemes:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const days = Math.ceil(
      (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <p className="text-gray-400 text-sm">Loading government schemes...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow mb-4">

      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-red-700">
          🏛️ Government Schemes
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Latest schemes matching your profile
        </p>
      </div>

      <div className="p-6">
        {schemes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">🏛️</p>
            <p className="text-gray-400">
              No matching schemes found for your profile
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {schemes.map((scheme) => {
              const isExpanded = expandedId === scheme._id;
              const daysLeft = getDaysLeft(scheme.deadline);
              const typeColor = TYPE_COLORS[scheme.type] || TYPE_COLORS.Other;

              return (
                <div
                  key={scheme._id}
                  className={`border rounded-lg overflow-hidden transition ${
                    isExpanded ? "border-red-300 shadow-sm" : "border-gray-200"
                  }`}
                >
                  <div
                    className="p-4 cursor-pointer hover:bg-red-50 transition"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : scheme._id)
                    }
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-3">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="font-semibold text-gray-800 text-sm">
                            {scheme.name}
                          </p>
                          {scheme.isNew && (
                            <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">
                              🆕 NEW
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {scheme.ministry}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor}`}
                        >
                          {scheme.type}
                        </span>
                        {daysLeft !== null && daysLeft > 0 && (
                          <span
                            className={`text-xs font-medium ${
                              daysLeft <= 7
                                ? "text-red-600"
                                : daysLeft <= 30
                                ? "text-green-700"
                                : "text-green-600"
                            }`}
                          >
                            {daysLeft} days left
                          </span>
                        )}
                      </div>
                    </div>
                    {scheme.benefit && (
                      <p className="text-sm text-green-700 font-medium mt-2">
                        💰 {scheme.benefit}
                      </p>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="border-t bg-gray-50 p-4 space-y-3">
                      <p className="text-sm text-gray-600">
                        {scheme.description}
                      </p>
                      {scheme.deadline && (
                        <p className="text-sm">
                          <span className="text-gray-400">Deadline: </span>
                          <span className="font-medium">
                            {formatDate(scheme.deadline)}
                          </span>
                        </p>
                      )}
                      {scheme.applicationLink && (
                        <a
                          href={scheme.applicationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition"
                        >
                          🌐 Apply Now
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default GovtSchemes;