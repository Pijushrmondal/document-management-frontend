// src/components/layout/AppLayout.jsx

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { setBreadcrumbs } from "../../store/slices/uiSlice";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function AppLayout({ children }) {
  const dispatch = useDispatch();
  const location = useLocation();

  // Update breadcrumbs based on current route
  useEffect(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = pathSegments.map((segment, index) => {
      const path = "/" + pathSegments.slice(0, index + 1).join("/");
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      return { label, path };
    });

    dispatch(setBreadcrumbs(breadcrumbs));
  }, [location.pathname, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 pt-16 overflow-y-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
