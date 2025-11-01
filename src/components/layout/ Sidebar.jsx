// src/components/layout/Sidebar.jsx

import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectSidebarOpen, setSidebarOpen } from "../../store/slices/uiSlice";
import { selectUser } from "../../store/slices/authSlice";
import { isAdmin, isAdminOrSupport } from "../../utils/helpers";

function Sidebar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const sidebarOpen = useSelector(selectSidebarOpen);
  const user = useSelector(selectUser);

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      dispatch(setSidebarOpen(false));
    }
  };

  // Navigation items
  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "📊",
      roles: null, // All roles
    },
    {
      name: "Documents",
      path: "/documents",
      icon: "📄",
      roles: null,
    },
    {
      name: "Folders",
      path: "/folders",
      icon: "📁",
      roles: null,
    },
    {
      name: "Actions",
      path: "/actions",
      icon: "🤖",
      roles: null,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: "✅",
      roles: null,
    },
    {
      name: "Webhooks",
      path: "/webhooks",
      icon: "🔗",
      roles: ["admin", "support"],
    },
    {
      name: "Audit Logs",
      path: "/audit",
      icon: "📝",
      roles: ["admin", "support"],
    },
    {
      name: "Metrics",
      path: "/metrics",
      icon: "📈",
      roles: null,
    },
  ];

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  });

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 bg-gray-800">
          <h1 className="text-white text-xl font-bold">📄 DMS</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-5 px-2 space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4 bg-gray-800">
          <div className="text-xs text-gray-400 text-center">
            <p>Document Management</p>
            <p className="mt-1">v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
