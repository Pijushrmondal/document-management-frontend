// src/components/webhooks/CreateWebhookModal.jsx

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createWebhook,
  updateWebhook,
  selectWebhookLoading,
} from "../../store/slices/webhookSlice";
import Modal from "../common/Modal";
import Button from "../common/Button";
import EventTypeSelector from "./EventTypeSelector";
import { validateWebhookData } from "../../utils/validators";
import { isValidUrl } from "../../utils/validators";

function CreateWebhookModal({
  isOpen,
  onClose,
  onSuccess,
  existingWebhook = null,
}) {
  const dispatch = useDispatch();
  const loading = useSelector(selectWebhookLoading);

  const isEditing = !!existingWebhook;

  const [formData, setFormData] = useState({
    url: existingWebhook?.url || "",
    events: existingWebhook?.events || [],
    description: existingWebhook?.description || "",
    isActive:
      existingWebhook?.isActive !== undefined ? existingWebhook.isActive : true,
  });

  const [errors, setErrors] = useState({});
  const [showSecret, setShowSecret] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const validation = validateWebhookData(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (isEditing) {
        await dispatch(
          updateWebhook({
            id: existingWebhook.id,
            updates: formData,
          })
        ).unwrap();
      } else {
        await dispatch(createWebhook(formData)).unwrap();
      }

      // Reset and close
      setFormData({
        url: "",
        events: [],
        description: "",
        isActive: true,
      });
      setErrors({});
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Webhook operation failed:", error);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        url: "",
        events: [],
        description: "",
        isActive: true,
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? "Edit Webhook" : "Create Webhook"}
      size="lg"
      closeOnOverlayClick={!loading}
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            {isEditing ? "Update" : "Create"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Webhook URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Webhook URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => handleChange("url", e.target.value)}
            placeholder="https://your-domain.com/webhook"
            disabled={loading}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.url ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.url && (
            <p className="mt-1 text-sm text-red-600">{errors.url}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            HTTPS URL where webhook events will be sent
          </p>
        </div>

        {/* Event Types */}
        <div>
          <EventTypeSelector
            selectedEvents={formData.events}
            onEventsChange={(events) => handleChange("events", events)}
            disabled={loading}
          />
          {errors.events && (
            <p className="mt-1 text-sm text-red-600">{errors.events}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Describe the purpose of this webhook..."
            rows={3}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-900">Active Status</p>
            <p className="text-xs text-gray-500">
              Enable or disable this webhook
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              disabled={loading}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-blue-600 text-xl mr-3">🔒</span>
            <div>
              <p className="text-sm font-medium text-blue-900">Security</p>
              <p className="text-xs text-blue-700 mt-1">
                {isEditing
                  ? "Webhook secret remains unchanged unless regenerated."
                  : "A secure secret key will be generated automatically. Use it to verify webhook authenticity."}
              </p>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default CreateWebhookModal;
