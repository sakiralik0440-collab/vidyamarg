import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { loginTeacherAPI } from "../api/studentApi";
import { useAuth } from "../context/AuthContext";

function TeacherLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    village: "",
    district: "",
    state: "Madhya Pradesh",
    phone: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginTeacherAPI(loginForm);
      login(data.teacher, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      login(data.teacher, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🎓</div>
          <h1 className="text-2xl font-bold text-orange-700">
            {t("auth.teacherPortal")}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {mode === "login" ? t("auth.login") : "Create your teacher account"}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex mb-6 border rounded-xl overflow-hidden">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 py-2.5 text-sm font-medium transition ${
              mode === "login"
                ? "bg-orange-600 text-white"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {t("auth.login")}
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); }}
            className={`flex-1 py-2.5 text-sm font-medium transition ${
              mode === "register"
                ? "bg-orange-600 text-white"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Register
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm mb-4 text-center bg-red-50 px-3 py-2 rounded">
            {error}
          </p>
        )}

        {/* Login Form */}
        {mode === "login" && (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                {t("auth.email")}
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                placeholder="teacher@example.com"
                className="w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                {t("auth.password")}
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((prev) => ({ ...prev, password: e.target.value }))
                }
                required
                placeholder="••••••••"
                className="w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition disabled:opacity-50"
            >
              {loading ? t("auth.loggingIn") : t("auth.loginButton")}
            </button>
          </form>
        )}

        {/* Register Form */}
        {mode === "register" && (
          <form onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(e) =>
                    setRegisterForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  required
                  minLength={6}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Village *
                </label>
                <input
                  type="text"
                  value={registerForm.village}
                  onChange={(e) =>
                    setRegisterForm((prev) => ({ ...prev, village: e.target.value }))
                  }
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  District *
                </label>
                <input
                  type="text"
                  value={registerForm.district}
                  onChange={(e) =>
                    setRegisterForm((prev) => ({ ...prev, district: e.target.value }))
                  }
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={registerForm.phone}
                  onChange={(e) =>
                    setRegisterForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  maxLength={10}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>
        )}

        {/* Back to portal */}
        <p className="text-center text-xs text-gray-400 mt-6">
          <button
            onClick={() => navigate("/")}
            className="hover:text-orange-600 underline"
          >
            ← Back to Portal
          </button>
        </p>
      </div>
    </div>
  );
}

export default TeacherLogin;