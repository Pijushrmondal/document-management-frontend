// src/components/documents/DocumentUpload.jsx

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadDocument,
  selectDocumentUploading,
  selectUploadProgress,
} from "../../store/slices/documentSlice";
import Modal from "../common/Modal";
import Button from "../common/Button";
import FileUploadZone from "./FileUploadZone";
import { getFileIcon, getFileTypeColor } from "../../utils/fileHelpers";
import { formatFileSize } from "../../utils/formatters";
import Badge from "../common/Badge";

function DocumentUpload({ isOpen, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const uploading = useSelector(selectDocumentUploading);
  const uploadProgress = useSelector(selectUploadProgress);

  const [selectedFile, setSelectedFile] = useState(null);
  const [primaryTag, setPrimaryTag] = useState("");
  const [secondaryTags, setSecondaryTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setErrors({});
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !secondaryTags.includes(tagInput.trim())) {
      setSecondaryTags([...secondaryTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setSecondaryTags(secondaryTags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!selectedFile) {
      newErrors.file = "Please select a file";
    }

    if (!primaryTag.trim()) {
      newErrors.primaryTag = "Primary tag (folder) is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await dispatch(
        uploadDocument({
          file: selectedFile,
          primaryTag: primaryTag.trim(),
          secondaryTags,
        })
      ).unwrap();

      // Reset form
      setSelectedFile(null);
      setPrimaryTag("");
      setSecondaryTags([]);
      setTagInput("");
      setErrors({});

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setSelectedFile(null);
      setPrimaryTag("");
      setSecondaryTags([]);
      setTagInput("");
      setErrors({});
      onClose();
    }
  };

  const progress = selectedFile ? uploadProgress[selectedFile.name] || 0 : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload Document"
      size="lg"
      closeOnOverlayClick={!uploading}
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={uploading}
            disabled={!selectedFile || !primaryTag}
          >
            Upload
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* File Upload Zone */}
        {!selectedFile ? (
          <div>
            <FileUploadZone onFileSelect={handleFileSelect} />
            {errors.file && (
              <p className="mt-2 text-sm text-red-600">{errors.file}</p>
            )}
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 rounded flex items-center justify-center text-2xl ${getFileTypeColor(
                    selectedFile.name
                  )}`}
                >
                  {getFileIcon(selectedFile.name)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              {!uploading && (
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Primary Tag (Folder) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Tag (Folder) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={primaryTag}
            onChange={(e) => setPrimaryTag(e.target.value)}
            placeholder="e.g., invoices-2025"
            disabled={uploading}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.primaryTag ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.primaryTag && (
            <p className="mt-1 text-sm text-red-600">{errors.primaryTag}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Each document must belong to exactly one folder (primary tag)
          </p>
        </div>

        {/* Secondary Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Secondary Tags (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add tags..."
              disabled={uploading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              variant="outline"
              onClick={handleAddTag}
              disabled={uploading || !tagInput.trim()}
            >
              Add
            </Button>
          </div>

          {/* Tag List */}
          {secondaryTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {secondaryTags.map((tag, index) => (
                <Badge key={index} variant="default">
                  {tag}
                  {!uploading && (
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default DocumentUpload;
