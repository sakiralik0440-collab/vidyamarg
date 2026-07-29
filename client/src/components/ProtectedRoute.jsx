import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { teacher, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!teacher) {
    return <Navigate to="/teacher/login" />;
  }

  return children;
}

export default ProtectedRoute;