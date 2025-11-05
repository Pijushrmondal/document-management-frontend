// src/pages/Documents.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDocuments,
  selectDocuments,
  selectPagination,
  selectDocumentLoading,
  selectViewMode,
  selectSearchResults,
  selectSearching,
  setViewMode,
  clearSearchResults,
} from "../store/slices/documentSlice";
import { selectUser } from "../store/slices/authSlice";
import { Permissions } from "../utils/permissions";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";
import Pagination from "../components/common/Pagination";
import DocumentGrid from "../components/documents/DocumentGrid";
import DocumentList from "../components/documents/DocumentList";
import DocumentUpload from "../components/documents/DocumentUpload";
import DocumentSearch from "../components/documents/DocumentSearch";
import AdminUserSelector from "../components/common/AdminUserSelector";

function Documents() {
  const dispatch = useDispatch();
  const documents = useSelector(selectDocuments);
  const searchResults = useSelector(selectSearchResults);
  const pagination = useSelector(selectPagination);
  const loading = useSelector(selectDocumentLoading);
  const searching = useSelector(selectSearching);
  const viewMode = useSelector(selectViewMode);
  const user = useSelector(selectUser);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Check permissions
  const canWrite = user && Permissions.canWrite(user.role);
  const isReadOnly = user && Permissions.isReadOnly(user.role);

  // Fetch documents on mount or when userId changes
  useEffect(() => {
    dispatch(fetchDocuments({ page: 1, limit: 20, userId: selectedUserId }));
  }, [dispatch, selectedUserId]);

  const handlePageChange = (page) => {
    dispatch(fetchDocuments({ page, limit: pagination.limit, userId: selectedUserId }));
  };

  const handleViewModeChange = (mode) => {
    dispatch(setViewMode(mode));
  };

  const handleUploadSuccess = () => {
    dispatch(fetchDocuments({ page: 1, limit: pagination.limit }));
  };

  const handleSearch = () => {
    setIsSearchMode(true);
    setShowSearch(false);
  };

  const handleClearSearch = () => {
    setIsSearchMode(false);
    dispatch(clearSearchResults());
    dispatch(fetchDocuments({ page: 1, limit: pagination.limit }));
  };

  const displayDocuments = isSearchMode ? searchResults : documents;

  // Debug logging in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('Documents page state:', {
        isSearchMode,
        searchResultsCount: searchResults.length,
        documentsCount: documents.length,
        displayDocumentsCount: displayDocuments.length,
        searchResults,
      });
    }
  }, [isSearchMode, searchResults, documents, displayDocuments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and organize your documents
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            icon="🔍"
            onClick={() => setShowSearch(!showSearch)}
          >
            Search
          </Button>
          {canWrite && (
            <Button
              variant="primary"
              icon="📤"
              onClick={() => setShowUploadModal(true)}
            >
              Upload
            </Button>
          )}
          {isReadOnly && (
            <div className="flex items-center px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <span className="text-sm text-yellow-800">
                Read-only access
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Admin User Selector */}
      <AdminUserSelector onUserSelect={setSelectedUserId} />

      {/* Search Section */}
      {showSearch && <DocumentSearch onSearch={handleSearch} />}

      {/* Search Mode Alert */}
      {isSearchMode && (
        <Alert type="info" title="Search Results">
          Showing search results.
          <button
            onClick={handleClearSearch}
            className="ml-2 font-medium underline hover:no-underline"
          >
            Clear search
          </button>
        </Alert>
      )}

      {/* Stats Card */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div>
              <p className="text-sm text-gray-500">Total Documents</p>
              <p className="text-2xl font-semibold text-gray-900">
                {isSearchMode ? searchResults.length : pagination.total}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Page</p>
              <p className="text-2xl font-semibold text-gray-900">
                {pagination.page} / {pagination.totalPages}
              </p>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => handleViewModeChange("grid")}
              className={`p-2 rounded ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title="Grid View"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => handleViewModeChange("list")}
              className={`p-2 rounded ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title="List View"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </Card>

      {/* Documents Display */}
      <div>
        {viewMode === "grid" ? (
          <DocumentGrid documents={displayDocuments} loading={isSearchMode ? searching : loading} />
        ) : (
          <DocumentList documents={displayDocuments} loading={isSearchMode ? searching : loading} />
        )}
      </div>

      {/* Pagination */}
      {!isSearchMode && !loading && documents.length > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}

      {/* Upload Modal */}
      <DocumentUpload
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}

export default Documents;
