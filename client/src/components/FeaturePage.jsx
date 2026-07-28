import { useNavigate } from "react-router-dom";

function FeaturePage({ icon, title, gradientFrom, gradientTo, studentId, children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header Banner */}
      <div
        className="px-6 py-8 sticky top-0 z-10 shadow-md"
        style={{
          background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
        }}
      >
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(`/profile/${studentId}`)}
            className="text-white/80 hover:text-white text-sm mb-3 flex items-center gap-1 transition"
          >
            ← Back to Profile
          </button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{icon}</span>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
}

export default FeaturePage;