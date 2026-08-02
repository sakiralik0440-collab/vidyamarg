import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { loginCompanyAPI, registerCompanyAPI } from "../api/studentApi";

function CompanyLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const [registerForm, setRegisterForm] = useState({
    companyName: "",
    email: "",
    password: "",
    location: "",
    district: "",
    state: "Madhya Pradesh",
    industryType: "",
    phone: "",
    description: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginCompanyAPI(loginForm);
      localStorage.setItem("companyToken", data.token);
      localStorage.setItem("companyInfo", JSON.stringify(data.company));
      navigate("/company/dashboard");
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
      const data = await registerCompanyAPI(registerForm);
      localStorage.setItem("companyToken", data.token);
      localStorage.setItem("companyInfo", JSON.stringify(data.company));
      navigate("/company/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* Gradient Header */}
          <div className="bg-gradient-to-br from-purple-600 to-fuchsia-700 px-8 pt-10 pb-8 text-center relative overflow-hidden">
            <div className="absolute -top-8 -right-6 w-28 h-28 bg-white/10 rounded-full" />
            <div className="absolute -bottom-6 -left-10 w-32 h-32 bg-white/10 rounded-full" />
            <div className="relative">
              <div className="text-5xl mb-3">🏢</div>
              <h1 className="text-white text-xl font-bold">
                {t("company.portal")}
              </h1>
              <p className="text-purple-100 text-xs mt-1">
                Find and hire talented village students
              </p>
            </div>
          </div>

          <div className="px-8 py-7">

            {/* Tab Toggle */}
            <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition ${
                  mode === "login"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t("company.login")}
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition ${
                  mode === "register"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t("company.register")}
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
                    {t("company.email")}
                  </label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    required
                    placeholder="company@example.com"
                    className="w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    {t("company.password")}
                  </label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                    placeholder="••••••••"
                    className="w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {loading ? "Logging in..." : t("company.loginButton")}
                </button>
              </form>
            )}

            {/* Register Form */}
            {mode === "register" && (
              <form onSubmit={handleRegister}>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium mb-1 text-gray-600">
                      {t("company.companyName")} *
                    </label>
                    <input
                      type="text"
                      value={registerForm.companyName}
                      onChange={(e) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          companyName: e.target.value,
                        }))
                      }
                      required
                      placeholder="e.g. Reliance Retail"
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium mb-1 text-gray-600">
                      {t("company.email")} *
                    </label>
                    <input
                      type="email"
                      value={registerForm.email}
                      onChange={(e) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      required
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium mb-1 text-gray-600">
                      {t("company.password")} *
                    </label>
                    <input
                      type="password"
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">
                      {t("company.location")} *
                    </label>
                    <input
                      type="text"
                      value={registerForm.location}
                      onChange={(e) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      required
                      placeholder="e.g. Indore, MP"
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">
                      {t("company.industryType")}
                    </label>
                    <input
                      type="text"
                      value={registerForm.industryType}
                      onChange={(e) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          industryType: e.target.value,
                        }))
                      }
                      placeholder="e.g. Retail, IT"
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">
                      {t("company.phone")}
                    </label>
                    <input
                      type="tel"
                      value={registerForm.phone}
                      onChange={(e) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">
                      {t("company.website")}
                    </label>
                    <input
                      type="text"
                      value={registerForm.website}
                      onChange={(e) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                      placeholder="www.company.com"
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium mb-1 text-gray-600">
                      {t("company.description")}
                    </label>
                    <textarea
                      value={registerForm.description}
                      onChange={(e) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={2}
                      placeholder="Brief description of your company"
                      className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {loading ? "Registering..." : t("company.registerButton")}
                </button>
              </form>
            )}

            {/* Back to portal */}
            <p className="text-center text-xs text-gray-400 mt-6">
              <button
                onClick={() => navigate("/")}
                className="hover:text-purple-600 underline"
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

export default CompanyLogin;