import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { loginTeacherAPI } from "../api/studentApi";
import { API_BASE_URL } from "../utils/config";
import { useAuth } from "../context/AuthContext";

function TeacherLogin({ initialMode = "login" }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

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
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* Gradient Header */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-8 pt-10 pb-8 text-center relative overflow-hidden">
            <div className="absolute -top-6 -right-10 w-32 h-32 bg-white/10 rounded-full" />
            <div className="absolute -bottom-10 -left-6 w-28 h-28 bg-white/10 rounded-full" />
            <div className="relative">
              <div className="text-5xl mb-3">👨‍🏫</div>
              <h1 className="text-white text-xl font-bold">
                {t("auth.teacherPortal")}
              </h1>
              <p className="text-blue-100 text-xs mt-1">
                {mode === "login" ? "Access your dashboard" : "Create your teacher account"}
              </p>
            </div>
          </div>

          <div className="px-8 py-7">

            {/* Tab Toggle */}
            <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => { setMode("login"); setError(""); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition ${
                  mode === "login"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t("auth.login")}
              </button>
              <button
                onClick={() => { setMode("register"); setError(""); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition ${
                  mode === "register"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
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
                    className="w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
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
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Registering..." : "Create Account"}
                </button>
              </form>
            )}

            {/* Back to portal */}
            <p className="text-center text-xs text-gray-400 mt-6">
              <button
                onClick={() => navigate("/")}
                className="hover:text-blue-600 underline"
              >
                ← Back to Portal
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherLogin;