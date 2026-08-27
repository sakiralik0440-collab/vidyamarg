import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If no auth token or user, redirect to portal selector
  if (!token && !user) {
    return <Navigate to="/" replace />;
  }

  // If allowedRoles is specified, check role
  if (allowedRoles && allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.role) && user.role !== "admin") {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md text-center shadow-2xl">
            <div className="text-4xl mb-3">🚫</div>
            <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-slate-400 text-sm mb-6">
              Your account ({user.role}) does not have permission to view this portal.
            </p>
            <a
              href="/"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-xl transition-all"
            >
              Return to Home
            </a>
          </div>
        </div>
      );
    }
  }

  return children;
}

export default ProtectedRoute;