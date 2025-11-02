// src/pages/Dashboard.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../store/slices/authSlice";
import { fetchDocuments, selectDocuments } from "../store/slices/documentSlice";
import { fetchTodaysTasks, selectTodaysTasks } from "../store/slices/taskSlice";
import { fetchMyMetrics, selectMyMetrics } from "../store/slices/metricsSlice";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import MetricCard from "../components/metrics/MetricCard";
import { formatRelativeTime } from "../utils/formatters";
import { USER_ROLES } from "../utils/constants";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const documents = useSelector(selectDocuments);
  const todaysTasks = useSelector(selectTodaysTasks);
  const myMetrics = useSelector(selectMyMetrics);

  useEffect(() => {
    // Fetch dashboard data
    dispatch(fetchDocuments({ page: 1, limit: 5 }));
    dispatch(fetchTodaysTasks());
    dispatch(fetchMyMetrics());
  }, [dispatch]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {getGreeting()}, {user?.username || "User"}! 👋
        </h1>
        <p className="text-blue-100">
          Welcome to your Document Management System dashboard
        </p>
        {user?.role === USER_ROLES.ADMIN && (
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm">
            <span className="mr-2">👑</span>
            Administrator Access
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="My Documents"
          value={myMetrics?.documents?.total || 0}
          icon="📄"
          color="blue"
          subtitle="Total uploaded"
        />
        <MetricCard
          title="My Actions"
          value={myMetrics?.actions?.total || 0}
          icon="🤖"
          color="purple"
          subtitle="AI executions"
        />
        <MetricCard
          title="My Tasks"
          value={todaysTasks?.length || 0}
          icon="✅"
          color="green"
          subtitle="Due today"
        />
        <MetricCard
          title="Storage Used"
          value={myMetrics?.storage?.used || "0 MB"}
          icon="💾"
          color="indigo"
          subtitle={`of ${myMetrics?.storage?.total || "5 GB"}`}
        />
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions" subtitle="Get started with common tasks">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/documents")}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="text-4xl mb-3">📤</div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Upload Document
            </h3>
            <p className="text-xs text-gray-600">
              Add new files to your library
            </p>
          </button>

          <button
            onClick={() => navigate("/actions")}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
          >
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="font-semibold text-gray-900 mb-1">Run AI Action</h3>
            <p className="text-xs text-gray-600">Process documents with AI</p>
          </button>

          <button
            onClick={() => navigate("/tasks")}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="text-4xl mb-3">📋</div>
            <h3 className="font-semibold text-gray-900 mb-1">Create Task</h3>
            <p className="text-xs text-gray-600">Add to your task board</p>
          </button>

          <button
            onClick={() => navigate("/folders")}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all group"
          >
            <div className="text-4xl mb-3">📁</div>
            <h3 className="font-semibold text-gray-900 mb-1">Manage Folders</h3>
            <p className="text-xs text-gray-600">Organize your documents</p>
          </button>
        </div>
      </Card>

      {/* Recent Documents & Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Documents */}
        <Card
          title="Recent Documents"
          subtitle="Your latest uploads"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/documents")}
            >
              View All
            </Button>
          }
        >
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No documents yet</p>
              <Button
                variant="primary"
                size="sm"
                className="mt-4"
                onClick={() => navigate("/documents")}
              >
                Upload Your First Document
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.slice(0, 5).map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => navigate(`/documents/${doc.id}`)}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {doc.filename}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatRelativeTime(doc.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Today's Tasks */}
        <Card
          title="Today's Tasks"
          subtitle={`${todaysTasks?.length || 0} task${
            todaysTasks?.length !== 1 ? "s" : ""
          } due`}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/tasks")}
            >
              View All
            </Button>
          }
        >
          {!todaysTasks || todaysTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No tasks due today</p>
              <p className="text-green-600 text-xs mt-2">
                ✅ You're all caught up!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {task.priority === "high"
                        ? "🔴"
                        : task.priority === "medium"
                        ? "🟡"
                        : "🟢"}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {task.status.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* System Status (Admin Only) */}
      {user?.role === USER_ROLES.ADMIN && (
        <Card title="System Status" subtitle="Platform health check">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-green-600 font-medium">API Status</p>
                <span className="text-2xl">✅</span>
              </div>
              <p className="text-lg font-bold text-green-900">Operational</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-blue-600 font-medium">Database</p>
                <span className="text-2xl">💾</span>
              </div>
              <p className="text-lg font-bold text-blue-900">Connected</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-purple-600 font-medium">
                  AI Service
                </p>
                <span className="text-2xl">🤖</span>
              </div>
              <p className="text-lg font-bold text-purple-900">Ready</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-yellow-600 font-medium">Webhooks</p>
                <span className="text-2xl">🔗</span>
              </div>
              <p className="text-lg font-bold text-yellow-900">Active</p>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/metrics")}
            >
              View Detailed Metrics →
            </Button>
          </div>
        </Card>
      )}

      {/* Help & Resources */}
      <Card title="Help & Resources" subtitle="Get started and learn more">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
            <p className="text-sm text-gray-600 mb-4">
              Learn how to use all features of the system
            </p>
            <Button variant="outline" size="sm">
              Read Docs
            </Button>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
            <div className="text-3xl mb-3">🎓</div>
            <h3 className="font-semibold text-gray-900 mb-2">Tutorials</h3>
            <p className="text-sm text-gray-600 mb-4">
              Step-by-step guides for common workflows
            </p>
            <Button variant="outline" size="sm">
              Watch Videos
            </Button>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get help from our support team
            </p>
            <Button variant="outline" size="sm">
              Contact Us
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;
