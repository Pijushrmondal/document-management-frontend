// src/components/layout/Navbar.jsx

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser, logoutUser } from "../../store/slices/authSlice";
import { toggleSidebar } from "../../store/slices/uiSlice";
import { ROLE_LABELS, USER_ROLES } from "../../utils/constants";
import { formatInitials } from "../../utils/formatters";
import { Permissions } from "../../utils/permissions";
import Breadcrumbs from "./Breadcrumbs";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full lg:w-[calc(100%-16rem)] lg:left-64 z-30 top-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={handleToggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Breadcrumbs */}
            <div className="ml-4 hidden sm:block">
              <Breadcrumbs />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* User info */}
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                  {formatInitials(user?.name || user?.email)}
                </div>
              </div>

              {/* User details */}
              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-700">
                    {user?.name || user?.email?.split("@")[0]}
                  </div>
                  {/* Role Badge */}
                  {user?.role && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        user.role === USER_ROLES.ADMIN
                          ? "bg-red-100 text-red-800"
                          : user.role === USER_ROLES.SUPPORT
                          ? "bg-blue-100 text-blue-800"
                          : user.role === USER_ROLES.MODERATOR
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  )}
                  {/* Read-Only Indicator */}
                  {user?.role && Permissions.isReadOnly(user.role) && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-800">
                      Read-Only
                    </span>
                  )}
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                title="Logout"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
