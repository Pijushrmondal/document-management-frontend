// src/pages/Folders.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFolders,
  selectFolders,
  selectTagLoading,
} from "../store/slices/tagSlice";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";
import FolderItem from "../components/tags/FolderItem";
import CreateTagModal from "../components/tags/CreateTagModal";

function Folders() {
  const dispatch = useDispatch();
  const folders = useSelector(selectFolders);
  const loading = useSelector(selectTagLoading);

  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(fetchFolders());
  }, [dispatch]);

  const handleCreateSuccess = () => {
    dispatch(fetchFolders());
  };

  const totalDocuments = folders.reduce(
    (sum, folder) => sum + (folder.documentCount || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Folders</h1>
          <p className="mt-1 text-sm text-gray-600">
            Organize your documents with folders
          </p>
        </div>
        <Button
          variant="primary"
          icon="➕"
          onClick={() => setShowCreateModal(true)}
        >
          Create Folder
        </Button>
      </div>

      {/* Stats Card */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div>
              <p className="text-sm text-gray-500">Total Folders</p>
              <p className="text-2xl font-semibold text-gray-900">
                {folders.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Documents</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalDocuments}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average per Folder</p>
              <p className="text-2xl font-semibold text-gray-900">
                {folders.length > 0
                  ? Math.round(totalDocuments / folders.length)
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Folders Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : folders.length === 0 ? (
        <Card>
          <EmptyState
            icon="📁"
            title="No folders yet"
            description="Create your first folder to organize documents."
            action={
              <Button
                variant="primary"
                icon="➕"
                onClick={() => setShowCreateModal(true)}
              >
                Create First Folder
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map((folder) => (
            <FolderItem key={folder.id} folder={folder} />
          ))}
        </div>
      )}

      {/* Create Tag Modal */}
      <CreateTagModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}

export default Folders;
