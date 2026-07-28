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
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🏢</div>
          <h1 className="text-2xl font-bold text-blue-700">
            {t("company.portal")}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Find and hire talented village students
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex mb-6 border rounded-lg overflow-hidden">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2.5 text-sm font-medium transition ${
              mode === "login"
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {t("company.login")}
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2.5 text-sm font-medium transition ${
              mode === "register"
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:bg-gray-50"
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
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
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
                  className="w-full border rounded px-3 py-2 text-sm"
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
                  className="w-full border rounded px-3 py-2 text-sm"
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
                  className="w-full border rounded px-3 py-2 text-sm"
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
                  className="w-full border rounded px-3 py-2 text-sm"
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
                  className="w-full border rounded px-3 py-2 text-sm"
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
                  className="w-full border rounded px-3 py-2 text-sm"
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
                  className="w-full border rounded px-3 py-2 text-sm"
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
                  className="w-full border rounded px-3 py-2 text-sm resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Registering..." : t("company.registerButton")}
            </button>
          </form>
        )}

        {/* Back to student portal */}
        <p className="text-center text-xs text-gray-400 mt-6">
          <button
            onClick={() => navigate("/")}
            className="hover:text-blue-600 underline"
          >
            ← Back to Student Portal
          </button>
        </p>
      </div>
    </div>
  );
}

export default CompanyLogin;