import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("vm_token") || localStorage.getItem("teacherToken"));
  const [role, setRole] = useState(localStorage.getItem("vm_role") || "student");
  const [activeChild, setActiveChild] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("vm_user") || localStorage.getItem("teacherInfo");
    const savedToken = localStorage.getItem("vm_token") || localStorage.getItem("teacherToken");
    const savedRole = localStorage.getItem("vm_role");

    if (savedUser && savedToken) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setRole(parsed.role || savedRole || "student");
        setToken(savedToken);
      } catch (e) {
        console.error("Auth state parse error", e);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    const normalizedUser = userData || { role: "student", name: "User", email: "" };
    setUser(normalizedUser);
    const userRole = normalizedUser.role || "student";
    setRole(userRole);
    setToken(authToken);

    localStorage.setItem("vm_token", authToken);
    localStorage.setItem("vm_role", userRole);
    localStorage.setItem("vm_user", JSON.stringify(normalizedUser));

    // Backward compatibility for legacy code
    localStorage.setItem("teacherToken", authToken);
    localStorage.setItem("teacherInfo", JSON.stringify(normalizedUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole("student");
    setActiveChild(null);

    localStorage.removeItem("vm_token");
    localStorage.removeItem("vm_role");
    localStorage.removeItem("vm_user");
    localStorage.removeItem("teacherToken");
    localStorage.removeItem("teacherInfo");
    localStorage.removeItem("companyToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || role,
        token,
        activeChild,
        setActiveChild,
        loading,
        login,
        logout,
        // Legacy alias
        teacher: user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      role: "student",
      token: null,
      activeChild: null,
      loading: false,
      login: () => {},
      logout: () => {},
      teacher: null,
    };
  }
  return context;
}