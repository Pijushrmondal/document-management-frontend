// src/components/auth/ProtectedRoute.jsx

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  selectIsAuthenticated,
  selectUser,
} from "../../store/slices/authSlice";
import { hasRole } from "../../utils/helpers";

/**
 * Protected Route Component
 * Redirects to login if not authenticated
 * Optionally checks for specific roles
 */
function ProtectedRoute({ children, roles = null }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role if specified
  if (roles && !hasRole(user, roles)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Required role(s): {Array.isArray(roles) ? roles.join(", ") : roles}
          </p>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
