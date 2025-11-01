// src/components/tags/FolderTree.jsx

import { useNavigate, useLocation } from "react-router-dom";
import Badge from "../common/Badge";
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";

function FolderTree({ folders, loading }) {
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (!folders || folders.length === 0) {
    return (
      <EmptyState
        icon="📁"
        title="No folders"
        description="Create a folder to organize your documents."
      />
    );
  }

  const getCurrentFolder = () => {
    const match = location.pathname.match(/\/folders\/([^/]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  };

  const currentFolder = getCurrentFolder();

  return (
    <div className="space-y-2">
      {/* All Documents */}
      <button
        onClick={() => navigate("/documents")}
        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
          location.pathname === "/documents"
            ? "bg-blue-100 text-blue-800 font-medium"
            : "hover:bg-gray-100 text-gray-700"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center">
            <span className="mr-2 text-lg">📄</span>
            All Documents
          </span>
        </div>
      </button>

      {/* Divider */}
      <div className="border-t border-gray-200 my-2"></div>

      {/* Folders List */}
      {folders.map((folder) => {
        const isActive = currentFolder === folder.name;

        return (
          <button
            key={folder.id}
            onClick={() => navigate(`/folders/${folder.name}`)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-blue-100 text-blue-800 font-medium"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center truncate">
                <span className="mr-2 text-lg">📁</span>
                <span className="truncate">{folder.name}</span>
              </span>
              {folder.documentCount > 0 && (
                <Badge variant={isActive ? "primary" : "default"} size="sm">
                  {folder.documentCount}
                </Badge>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default FolderTree;
