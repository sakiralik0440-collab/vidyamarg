import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentLogin() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://vidyamarg-backend.onrender.com/api/students/find-by-phone/${phone}`
      );
      const data = await response.json();
      if (!response.ok || !data.student) {
        setError("No student found with this phone number");
        return;
      }
      localStorage.setItem("studentId", data.student._id);
      navigate(`/profile/${data.student._id}`);
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* Gradient Header */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 px-8 pt-10 pb-8 text-center relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/10 rounded-full" />
            <div className="relative">
              <div className="text-5xl mb-3">👤</div>
              <h1 className="text-white text-xl font-bold">Student Login</h1>
              <p className="text-green-100 text-xs mt-1">
                Enter your registered phone number
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-7">
            <button
              onClick={() => navigate("/")}
              className="text-xs text-gray-400 hover:text-green-700 mb-4 flex items-center gap-1"
            >
              ← Back to Portal
            </button>

            <form onSubmit={handleSearch}>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                Phone Number
              </label>
              <div className="relative mb-4">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  📱
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  maxLength={10}
                  placeholder="10-digit phone number"
                  className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none focus:border-green-500 transition"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
                  <p className="text-red-600 text-xs text-center">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "Searching..." : "Find My Profile →"}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                New student?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-green-700 font-semibold hover:underline"
                >
                  Register here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;