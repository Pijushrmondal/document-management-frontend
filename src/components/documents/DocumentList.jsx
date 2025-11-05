import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadDocument,
  deleteDocument,
} from "../../store/slices/documentSlice";
import { selectUser } from "../../store/slices/authSlice";
import { Permissions } from "../../utils/permissions";
import { getFileIcon, getFileTypeColor } from "../../utils/fileHelpers";
import { formatFileSize, formatDate } from "../../utils/formatters";
import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";
import LoadingSpinner from "../common/LoadingSpinner";
import ConfirmDialog from "../common/ConfirmDialog";

function DocumentList({ documents, loading }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [deleteDocId, setDeleteDocId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Check permissions
  const canWrite = user && Permissions.canWrite(user.role);

  const handleDownload = async (doc) => {
    setActionLoading(true);
    try {
      await dispatch(
        downloadDocument({
          id: doc.id,
          filename: doc.filename,
        })
      ).unwrap();
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await dispatch(deleteDocument(deleteDocId)).unwrap();
      setDeleteDocId(null);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <EmptyState
        icon="📄"
        title="No documents found"
        description="Upload your first document to get started."
      />
    );
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Folder
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className={`flex-shrink-0 h-10 w-10 rounded flex items-center justify-center text-xl ${getFileTypeColor(
                        doc.filename
                      )}`}
                    >
                      {getFileIcon(doc.filename)}
                    </div>
                    <div className="ml-4">
                      <div
                        className="text-sm font-medium text-gray-900 truncate max-w-xs"
                        title={doc.filename}
                      >
                        {doc.filename}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatFileSize(doc.fileSize || doc.size)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {doc.primaryTag && (
                    <Badge variant="primary" size="sm">
                      📁 {doc.primaryTag}
                    </Badge>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {doc.secondaryTags?.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="default" size="sm">
                        {tag}
                      </Badge>
                    ))}
                    {doc.secondaryTags?.length > 2 && (
                      <Badge variant="default" size="sm">
                        +{doc.secondaryTags.length - 2}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDate(doc.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDownload(doc)}
                    disabled={actionLoading}
                    className="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50"
                  >
                    📥 Download
                  </button>
                  {canWrite && (
                    <button
                      onClick={() => setDeleteDocId(doc.id)}
                      disabled={actionLoading}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!deleteDocId}
        onClose={() => setDeleteDocId(null)}
        onConfirm={handleDelete}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
        loading={actionLoading}
      />
    </>
  );
}

export default DocumentList;
