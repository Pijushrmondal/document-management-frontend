// src/pages/DocumentDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDocumentById,
  downloadDocument,
  deleteDocument,
  selectCurrentDocument,
  selectDocumentLoading,
} from "../store/slices/documentSlice";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { getFileIcon, getFileTypeColor } from "../utils/fileHelpers";
import { formatFileSize, formatDate } from "../utils/formatters";

function DocumentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const document = useSelector(selectCurrentDocument);
  const loading = useSelector(selectDocumentLoading);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchDocumentById(id));
    }
  }, [id, dispatch]);

  const handleDownload = async () => {
    setActionLoading(true);
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
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await dispatch(deleteDocument(document.id)).unwrap();
      navigate("/documents");
    } catch (error) {
      console.error("Delete failed:", error);
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📄</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Document Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The document you're looking for doesn't exist.
        </p>
        <Button variant="primary" onClick={() => navigate("/documents")}>
          Back to Documents
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/documents")}>
            ← Back
          </Button>
          <div className="flex gap-2">
            <Button
              variant="primary"
              icon="📥"
              onClick={handleDownload}
              loading={actionLoading}
            >
              Download
            </Button>
            <Button
              variant="danger"
              icon="🗑️"
              onClick={() => setShowDeleteDialog(true)}
              loading={actionLoading}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Document Info Card */}
        <Card>
          <div className="flex items-start space-x-6">
            {/* File Icon */}
            <div
              className={`flex-shrink-0 w-24 h-24 rounded-lg flex items-center justify-center text-5xl ${getFileTypeColor(
                document.filename
              )}`}
            >
              {getFileIcon(document.filename)}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 break-words">
                {document.filename}
              </h1>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">File Size</p>
                  <p className="text-base font-medium text-gray-900">
                    {formatFileSize(document.size)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">MIME Type</p>
                  <p className="text-base font-medium text-gray-900">
                    {document.mimeType || "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="text-base font-medium text-gray-900">
                    {formatDate(document.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Updated At</p>
                  <p className="text-base font-medium text-gray-900">
                    {formatDate(document.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tags Card */}
        <Card title="Tags" subtitle="Document classification">
          <div className="space-y-4">
            {/* Primary Tag */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Primary Tag (Folder)
              </p>
              {document.primaryTag ? (
                <Badge variant="primary" size="lg">
                  📁 {document.primaryTag}
                </Badge>
              ) : (
                <p className="text-sm text-gray-500">No primary tag</p>
              )}
            </div>

            {/* Secondary Tags */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Secondary Tags
              </p>
              {document.secondaryTags && document.secondaryTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {document.secondaryTags.map((tag, index) => (
                    <Badge key={index} variant="default" size="lg">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No secondary tags</p>
              )}
            </div>
          </div>
        </Card>

        {/* File Path Card */}
        {document.filePath && (
          <Card title="File Information">
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Document ID
                </dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">
                  {document.id}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">File Path</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono break-all">
                  {document.filePath}
                </dd>
              </div>
            </dl>
          </Card>
        )}
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
        loading={actionLoading}
      />
    </>
  );
}

export default DocumentDetails;
