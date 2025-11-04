// src/components/tags/FolderItem.jsx

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteTag, fetchFolders } from "../../store/slices/tagSlice";
import Badge from "../common/Badge";
import ConfirmDialog from "../common/ConfirmDialog";

function FolderItem({ folder, showActions = true }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    navigate(`/folders/${folder.name}`);
  };

  const handleDelete = async (e) => {
    // Stop propagation if called from click event
    if (e && e.stopPropagation) {
    e.stopPropagation();
    }
    setLoading(true);
    try {
      await dispatch(deleteTag(folder.id)).unwrap();
      setShowDeleteDialog(false);
      // Refresh folders list after successful delete
      await dispatch(fetchFolders());
    } catch (error) {
      // Error is already shown via toast in the thunk
      // Keep dialog open so user can see the error and try again if needed
      console.error("Delete failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Folder Icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
              📁
            </div>

            {/* Folder Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {folder.name}
              </h3>
              <p className="text-sm text-gray-600">
                {folder.documentCount || 0} document
                {folder.documentCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDeleteClick}
                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete folder"
              >
                🗑️
              </button>
            </div>
          )}
        </div>

        {/* Document Count Badge */}
        {folder.documentCount > 0 && (
          <div className="mt-4">
            <Badge variant="primary">{folder.documentCount} documents</Badge>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Folder"
        message={
          folder.documentCount > 0
            ? `⚠️ Warning: "${folder.name}" contains ${folder.documentCount} document(s). The deletion will fail if documents are still assigned to this folder. Please remove or reassign all documents first.`
            : `Are you sure you want to delete "${folder.name}"? This action cannot be undone.`
        }
        confirmText="Delete"
        confirmVariant="danger"
        loading={loading}
      />
    </>
  );
}

export default FolderItem;
