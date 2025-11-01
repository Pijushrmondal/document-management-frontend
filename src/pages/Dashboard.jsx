// src/pages/Dashboard.jsx

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser, logoutUser } from "../store/slices/authSlice";
import { ROLE_LABELS } from "../utils/constants";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              📄 Document Management System
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mr-4">
              👤
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.email?.split("@")[0] || "User"}!
              </h2>
              <p className="text-gray-600">
                Role:{" "}
                <span className="font-semibold">
                  {ROLE_LABELS[user?.role] || "User"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            User Information
          </h3>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">User ID</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user?.id || "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user?.email || "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {ROLE_LABELS[user?.role] || "User"}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user?.name || "N/A"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Session 1
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Foundation Complete
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Session 2
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Redux Store Ready
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Session 3
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Auth Working!
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Status */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            System Modules
          </h3>
          <div className="space-y-3">
            <ModuleStatus name="Authentication" status="complete" />
            <ModuleStatus name="Documents" status="pending" />
            <ModuleStatus name="Tags/Folders" status="pending" />
            <ModuleStatus name="Actions" status="pending" />
            <ModuleStatus name="Tasks" status="pending" />
            <ModuleStatus name="Webhooks" status="pending" />
            <ModuleStatus name="Audit" status="pending" />
            <ModuleStatus name="Metrics" status="pending" />
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            🎯 Next Steps
          </h3>
          <p className="text-blue-800">
            <strong>Session 4:</strong> Layout & Common Components (Sidebar,
            Navbar, Buttons, Cards, Modals)
          </p>
        </div>
      </main>
    </div>
  );
}

// Module Status Component
function ModuleStatus({ name, status }) {
  const statusConfig = {
    complete: {
      icon: "✅",
      text: "Complete",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
    },
    pending: {
      icon: "⏳",
      text: "Pending",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
      <span className="text-gray-700 font-medium">{name}</span>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
      >
        {config.icon} {config.text}
      </span>
    </div>
  );
}

export default Dashboard;
