// src/components/tags/CreateTagModal.jsx

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTag, selectTagLoading } from "../../store/slices/tagSlice";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { validateTagName } from "../../utils/validators";

function CreateTagModal({ isOpen, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const loading = useSelector(selectTagLoading);

  const [tagName, setTagName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    // Validate
    const validation = validateTagName(tagName);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    try {
      await dispatch(createTag(tagName.trim())).unwrap();

      // Reset and close
      setTagName("");
      setError("");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setTagName("");
      setError("");
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Tag/Folder"
      size="md"
      closeOnOverlayClick={!loading}
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={!tagName.trim()}
          >
            Create
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tag/Folder Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={tagName}
            onChange={(e) => {
              setTagName(e.target.value);
              setError("");
            }}
            placeholder="e.g., invoices-2025"
            disabled={loading}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          <p className="mt-2 text-xs text-gray-500">
            Use lowercase letters, numbers, hyphens, and underscores only
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Tags can be used as folders (primary tags)
            or additional labels (secondary tags) for documents.
          </p>
        </div>
      </div>
    </Modal>
  );
}

export default CreateTagModal;
