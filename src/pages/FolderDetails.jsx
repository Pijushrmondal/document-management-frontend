// src/pages/FolderDetails.jsx

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFolderDocuments,
  selectFolderDocuments,
  selectCurrentFolder,
  selectTagLoading,
} from "../store/slices/tagSlice";
import { setViewMode, selectViewMode } from "../store/slices/documentSlice";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import LoadingSpinner from "../components/common/LoadingSpinner";
import DocumentGrid from "../components/documents/DocumentGrid";
import DocumentList from "../components/documents/DocumentList";

function FolderDetails() {
  const { name } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const documents = useSelector(selectFolderDocuments);
  const currentFolder = useSelector(selectCurrentFolder);
  const loading = useSelector(selectTagLoading);
  const viewMode = useSelector(selectViewMode);

  useEffect(() => {
    if (name) {
      dispatch(fetchFolderDocuments(name));
    }
  }, [name, dispatch]);

  const handleViewModeChange = (mode) => {
    dispatch(setViewMode(mode));
  };

  if (loading && documents.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate("/folders")}>
              ← Back
            </Button>
            <div>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">📁</span>
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {documents.length} document{documents.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Stats & View Toggle */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <p className="text-sm text-gray-500">Documents</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {documents.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Folder</p>
                <Badge variant="primary">{name}</Badge>
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
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
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
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
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
            <DocumentGrid documents={documents} loading={loading} />
          ) : (
            <DocumentList documents={documents} loading={loading} />
          )}
        </div>
      </div>
    </>
  );
}

export default FolderDetails;
