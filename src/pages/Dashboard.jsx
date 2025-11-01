// src/pages/Dashboard.jsx

import { useSelector } from "react-redux";
import { selectUser } from "../store/slices/authSlice";
import { ROLE_LABELS } from "../utils/constants";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";

function Dashboard() {
  const user = useSelector(selectUser);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card>
        <div className="flex items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mr-4">
            👤
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.email?.split("@")[0] || "User"}!
            </h2>
            <p className="text-gray-600">
              Role:{" "}
              <Badge variant="primary">
                {ROLE_LABELS[user?.role] || "User"}
              </Badge>
            </p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Session 1</p>
              <p className="text-lg font-medium text-gray-900">Foundation</p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Session 2</p>
              <p className="text-lg font-medium text-gray-900">Redux Store</p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Session 3</p>
              <p className="text-lg font-medium text-gray-900">Auth System</p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Session 4</p>
              <p className="text-lg font-medium text-gray-900">Layout & UI</p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Session 5</p>
              <p className="text-lg font-medium text-gray-900">Documents</p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Next</p>
              <p className="text-lg font-medium text-gray-900">More Modules</p>
            </div>
          </div>
        </Card>
      </div>

      {/* User Info Card */}
      <Card title="User Information" subtitle="Your account details">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">User ID</dt>
            <dd className="mt-1 text-sm text-gray-900">{user?.id || "N/A"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {user?.email || "N/A"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Role</dt>
            <dd className="mt-1">
              <Badge variant="primary">
                {ROLE_LABELS[user?.role] || "User"}
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {user?.name || "N/A"}
            </dd>
          </div>
        </dl>
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions" subtitle="Common tasks">
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" icon="📄">
            Upload Document
          </Button>
          <Button variant="secondary" icon="📁">
            Create Folder
          </Button>
          <Button variant="success" icon="🤖">
            Run Action
          </Button>
          <Button variant="outline" icon="✅">
            Create Task
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;
