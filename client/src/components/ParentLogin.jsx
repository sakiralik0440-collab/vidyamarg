import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ParentLogin({ initialMode = "login" }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    childName: "",
    childRollNo: "",
  });

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const completeAuth = (userData) => {
    const authToken = `parent-demo-${Date.now()}`;
    localStorage.setItem("vm_token", authToken);
    localStorage.setItem("vm_role", "parent");
    localStorage.setItem("vm_user", JSON.stringify({ ...userData, role: "parent" }));
    localStorage.setItem("parentToken", authToken);
    localStorage.setItem("parentInfo", JSON.stringify({ ...userData, role: "parent" }));
    navigate("/");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!loginForm.email || !loginForm.password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    completeAuth({
      id: "parent-demo",
      name: loginForm.email.split("@")[0],
      email: loginForm.email,
      role: "parent",
    });
    setLoading(false);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setError("Please complete name, email and password.");
      setLoading(false);
      return;
    }

    completeAuth({
      id: "parent-demo",
      name: registerForm.name,
      email: registerForm.email,
      phone: registerForm.phone,
      childName: registerForm.childName,
      childRollNo: registerForm.childRollNo,
      role: "parent",
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-violet-600 to-fuchsia-700 px-8 pt-10 pb-8 text-center relative overflow-hidden">
            <div className="absolute -top-8 -right-6 w-28 h-28 bg-white/10 rounded-full" />
            <div className="absolute -bottom-6 -left-10 w-32 h-32 bg-white/10 rounded-full" />
            <div className="relative">
              <div className="text-5xl mb-3">👨‍👩‍👧</div>
              <h1 className="text-white text-xl font-bold">Parent Portal</h1>
              <p className="text-violet-100 text-xs mt-1">
                {mode === "login" ? "Access your child dashboard" : "Create parent account"}
              </p>
            </div>
          </div>

          <div className="px-8 py-7">
            <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition ${
                  mode === "login" ? "bg-white text-violet-700 shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition ${
                  mode === "register" ? "bg-white text-violet-700 shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Register
              </button>
            </div>

            {error && (
              <p className="text-red-600 text-sm mb-4 text-center bg-red-50 px-3 py-2 rounded">{error}</p>
            )}

            {mode === "login" ? (
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                    required
                    className="w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-violet-600 text-white py-3 rounded-lg font-medium hover:bg-violet-700 transition disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium mb-1 text-gray-600">Full Name *</label>
                    <input
                      type="text"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm((prev) => ({ ...prev, name: e.target.value }))}
                      required
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium mb-1 text-gray-600">Email *</label>
                    <input
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                      required
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium mb-1 text-gray-600">Password *</label>
                    <input
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                      required
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium mb-1 text-gray-600">Phone</label>
                    <input
                      type="tel"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Child Name</label>
                    <input
                      type="text"
                      value={registerForm.childName}
                      onChange={(e) => setRegisterForm((prev) => ({ ...prev, childName: e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Child Roll No</label>
                    <input
                      type="text"
                      value={registerForm.childRollNo}
                      onChange={(e) => setRegisterForm((prev) => ({ ...prev, childRollNo: e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-violet-600 text-white py-3 rounded-lg font-medium hover:bg-violet-700 transition disabled:opacity-50"
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParentLogin;
