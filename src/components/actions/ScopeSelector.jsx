// src/components/actions/ScopeSelector.jsx

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectFolders } from "../../store/slices/tagSlice";
import { selectDocuments } from "../../store/slices/documentSlice";
import Alert from "../common/Alert";

function ScopeSelector({ scope, onScopeChange }) {
  const folders = useSelector(selectFolders);
  const documents = useSelector(selectDocuments);

  const [scopeType, setScopeType] = useState(scope?.type || "folder");
  const [selectedFolder, setSelectedFolder] = useState(scope?.name || "");
  const [selectedFiles, setSelectedFiles] = useState(scope?.ids || []);

  useEffect(() => {
    // Update parent component
    if (scopeType === "folder") {
      onScopeChange({
        type: "folder",
        name: selectedFolder,
      });
    } else {
      onScopeChange({
        type: "files",
        ids: selectedFiles,
      });
    }
  }, [scopeType, selectedFolder, selectedFiles]);

  const handleScopeTypeChange = (type) => {
    setScopeType(type);
    // Reset selections
    setSelectedFolder("");
    setSelectedFiles([]);
  };

  const handleFileToggle = (fileId) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  return (
    <div className="space-y-4">
      {/* Scope Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Scope <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleScopeTypeChange("folder")}
            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
              scopeType === "folder"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <div className="text-2xl mb-1">📁</div>
            <div className="font-medium">Folder</div>
            <div className="text-xs text-gray-600">
              Run on all files in a folder
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleScopeTypeChange("files")}
            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
              scopeType === "files"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <div className="text-2xl mb-1">📄</div>
            <div className="font-medium">Specific Files</div>
            <div className="text-xs text-gray-600">Select individual files</div>
          </button>
        </div>
      </div>

      {/* XOR Warning */}
      <Alert type="warning" title="Important">
        You must choose <strong>either</strong> a folder <strong>OR</strong>{" "}
        specific files, not both.
      </Alert>

      {/* Folder Selection */}
      {scopeType === "folder" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Folder <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-- Select a folder --</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.name}>
                📁 {folder.name} ({folder.documentCount || 0} docs)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Files Selection */}
      {scopeType === "files" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Files <span className="text-red-500">*</span>
          </label>
          <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
            {documents.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No documents available. Upload some documents first.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {documents.map((doc) => (
                  <label
                    key={doc.id}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(doc.id)}
                      onChange={() => handleFileToggle(doc.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-900 truncate">
                      {doc.filename}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
          {selectedFiles.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""}{" "}
              selected
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ScopeSelector;
