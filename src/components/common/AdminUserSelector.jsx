// src/components/common/AdminUserSelector.jsx

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/authSlice";
import { Permissions } from "../../utils/permissions";
import { USER_ROLES } from "../../utils/constants";

/**
 * AdminUserSelector Component
 * Allows admin users to select a user to query their data
 * @param {function} onUserSelect - Callback when user is selected (receives userId or null)
 */
function AdminUserSelector({ onUserSelect }) {
  const user = useSelector(selectUser);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Only show for admins
  const isAdmin = user && Permissions.hasFullAccess(user.role);

  useEffect(() => {
    if (isAdmin && selectedUserId) {
      onUserSelect(selectedUserId);
    } else if (isAdmin && !selectedUserId) {
      onUserSelect(null);
    }
  }, [selectedUserId, isAdmin, onUserSelect]);

  // For now, we'll use a simple input. In a real app, you'd fetch users from an API
  // For demo purposes, we'll use a text input or could fetch from an endpoint
  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedUserId(value);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          View data for user:
        </label>
        <div className="flex-1">
          <input
            type="text"
            value={selectedUserId}
            onChange={handleChange}
            placeholder="Enter user ID (leave empty for all users)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        {selectedUserId && (
          <button
            onClick={() => {
              setSelectedUserId("");
              onUserSelect(null);
            }}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Admin only: Enter a user ID to view their documents/folders, or leave empty to view all.
      </p>
    </div>
  );
}

export default AdminUserSelector;

