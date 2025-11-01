// src/components/documents/FileUploadZone.jsx

import { useCallback, useState } from "react";
import { validateFile } from "../../utils/validators";
import { getFileIcon, getFileTypeColor } from "../../utils/fileHelpers";
import { formatFileSize } from "../../utils/formatters";

function FileUploadZone({ onFileSelect, accept = "*", maxSize = 10485760 }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      setError(null);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        const validation = validateFile(file);

        if (!validation.valid) {
          setError(validation.error);
          return;
        }

        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleChange = useCallback(
    (e) => {
      e.preventDefault();
      setError(null);

      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const validation = validateFile(file);

        if (!validation.valid) {
          setError(validation.error);
          return;
        }

        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div>
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : error
            ? "border-red-300 bg-red-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept={accept}
        />

        <div className="space-y-2">
          <div className="text-6xl">📄</div>
          <div className="text-lg font-medium text-gray-900">
            {dragActive ? "Drop file here" : "Drag & drop file here"}
          </div>
          <div className="text-sm text-gray-600">or click to browse</div>
          <div className="text-xs text-gray-500">
            Max file size: {formatFileSize(maxSize)}
          </div>
        </div>
      </div>

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </div>
  );
}

export default FileUploadZone;
