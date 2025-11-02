// src/components/documents/DocumentCard.jsx

import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  downloadDocument,
  deleteDocument,
} from "../../store/slices/documentSlice";
import { getFileIcon, getFileTypeColor } from "../../utils/fileHelpers";
import { formatFileSize, formatRelativeTime } from "../../utils/formatters";
import Badge from "../common/Badge";
import ConfirmDialog from "../common/ConfirmDialog";

function DocumentCard({ document }) {
  const dispatch = useDispatch();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await dispatch(
        downloadDocument({
          id: document.id,
          filename: document.filename,
        })
      ).unwrap();
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await dispatch(deleteDocument(document.id)).unwrap();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4">
        {/* File Icon */}
        <div className="flex items-center justify-center mb-3">
          <div
            className={`w-16 h-16 rounded-lg flex items-center justify-center text-3xl ${getFileTypeColor(
              document.filename
            )}`}
          >
            {getFileIcon(document.filename)}
          </div>
        </div>

        {/* File Name */}
        <h3
          className="text-sm font-medium text-gray-900 truncate mb-2"
          title={document.filename}
        >
          {document.filename}
        </h3>

        {/* File Info */}
        <div className="space-y-1 mb-3">
          <p className="text-xs text-gray-500">
            {formatFileSize(document.fileSize || document.size)}
          </p>
          <p className="text-xs text-gray-500">
            {formatRelativeTime(document.createdAt)}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {/* Primary Tag */}
          {document.primaryTag && (
            <Badge variant="primary" size="sm">
              📁 {document.primaryTag}
            </Badge>
          )}

          {/* Secondary Tags (max 2 shown) */}
          {document.secondaryTags?.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="default" size="sm">
              {tag}
            </Badge>
          ))}

          {document.secondaryTags?.length > 2 && (
            <Badge variant="default" size="sm">
              +{document.secondaryTags.length - 2}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            disabled={loading}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "⏳" : "📥"} Download
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            disabled={loading}
            className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${document.filename}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={loading}
      />
    </>
  );
}

export default DocumentCard;


