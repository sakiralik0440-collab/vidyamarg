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
        `http://localhost:5000/api/students/find-by-phone/${phone}`
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
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <button
          onClick={() => navigate("/")}
          className="text-xs text-gray-400 hover:text-orange-600 mb-4"
        >
          ← Back
        </button>

        <div className="text-center mb-6">
          <div className="text-4xl mb-2">👤</div>
          <h1 className="text-xl font-bold text-gray-800">Student Login</h1>
          <p className="text-xs text-gray-400 mt-1">
            Enter the phone number used during registration
          </p>
        </div>

        <form onSubmit={handleSearch}>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            maxLength={10}
            placeholder="10-digit phone number"
            className="w-full border rounded-lg px-3 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {error && (
            <p className="text-red-500 text-xs mb-3 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-orange-700 transition disabled:opacity-50"
          >
            {loading ? "Searching..." : "Find My Profile"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          New student?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-orange-600 underline"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

export default StudentLogin;