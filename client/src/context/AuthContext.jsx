import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [teacher, setTeacher] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("teacherToken"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTeacher = localStorage.getItem("teacherInfo");
    const savedToken = localStorage.getItem("teacherToken");

    if (savedTeacher && savedToken) {
      setTeacher(JSON.parse(savedTeacher));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = (teacherData, authToken) => {
    setTeacher(teacherData);
    setToken(authToken);
    localStorage.setItem("teacherToken", authToken);
    localStorage.setItem("teacherInfo", JSON.stringify(teacherData));
  };

  const logout = () => {
    setTeacher(null);
    setToken(null);
    localStorage.removeItem("teacherToken");
    localStorage.removeItem("teacherInfo");
  };

  return (
    <AuthContext.Provider value={{ teacher, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return { teacher: null, token: null, loading: false, login: () => { }, logout: () => { } };
  }
  return context;
}