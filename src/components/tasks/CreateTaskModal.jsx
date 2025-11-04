import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTask,
  updateTask,
  selectTaskLoading,
} from "../../store/slices/taskSlice";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { validateTaskData } from "../../utils/validators";
import {
  TASK_TYPES,
  TASK_TYPE_LABELS,
  TASK_CHANNELS,
  TASK_CHANNEL_LABELS,
  TASK_STATUS,
  TASK_STATUS_LABELS,
} from "../../utils/constants";

function CreateTaskModal({ isOpen, onClose, onSuccess, existingTask = null }) {
  const dispatch = useDispatch();
  const loading = useSelector(selectTaskLoading);

  const isEditing = !!existingTask;

  const [formData, setFormData] = useState({
    source: "",
    type: "follow_up",
    channel: "email",
    target: "",
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
    metadataKey: "",
    metadataValue: "",
  });

  const [metadata, setMetadata] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existingTask && isOpen) {
      setFormData({
        source: existingTask.source || "",
        type: existingTask.type || "follow_up",
        channel: existingTask.channel || "email",
        target: existingTask.target || "",
        title: existingTask.title || "",
        description: existingTask.description || existingTask.notes || "",
        status: existingTask.status || "pending",
        dueDate: existingTask.dueDate 
          ? (existingTask.dueDate.includes('T') 
              ? existingTask.dueDate.split("T")[0] 
              : existingTask.dueDate.split(" ")[0])
          : "",
        metadataKey: "",
        metadataValue: "",
      });
      setMetadata(existingTask.metadata || {});
      setErrors({});
    } else if (!existingTask && isOpen) {
      setFormData({
        source: "",
        type: "follow_up",
        channel: "email",
        target: "",
        title: "",
        description: "",
        status: "pending",
        dueDate: "",
        metadataKey: "",
        metadataValue: "",
      });
      setMetadata({});
      setErrors({});
    }
  }, [existingTask, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const validationData = {
      ...formData,
      dueDate: formData.dueDate
        ? new Date(formData.dueDate).toISOString()
        : null,
      metadata: metadata,
    };

    const validation = validateTaskData(validationData);
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
      let dueDateISO = null;
      if (formData.dueDate) {
        const date = new Date(formData.dueDate);
        date.setHours(23, 59, 59, 999);
        dueDateISO = date.toISOString();
      }

      if (isEditing) {
        const taskId = existingTask.id || existingTask._id;
        if (!taskId) {
          console.error("Task ID not found");
          return;
        }
        
        const updates = {
          status: formData.status,
          notes: formData.description || undefined,
          dueDate: dueDateISO || undefined,
        };
        
        Object.keys(updates).forEach(
          (key) => updates[key] === undefined && delete updates[key]
        );
        
        await dispatch(
          updateTask({ id: taskId, updates })
        ).unwrap();
      } else {
        const taskData = {
          source: formData.source || undefined,
          type: formData.type,
          channel: formData.channel,
          target: formData.target || undefined,
          title: formData.title,
          description: formData.description || undefined,
          dueDate: dueDateISO || undefined,
          metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
        };

        Object.keys(taskData).forEach(
          (key) => taskData[key] === undefined && delete taskData[key]
        );
        
        await dispatch(createTask(taskData)).unwrap();
      }

      setFormData({
        source: "",
        type: "follow_up",
        channel: "email",
        target: "",
        title: "",
        description: "",
        status: "pending",
        dueDate: "",
        metadataKey: "",
        metadataValue: "",
      });
      setMetadata({});
      setErrors({});
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Task operation failed:", error);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        source: "",
        type: "follow_up",
        channel: "email",
        target: "",
        title: "",
        description: "",
        status: "pending",
        dueDate: "",
        metadataKey: "",
        metadataValue: "",
      });
      setMetadata({});
      setErrors({});
      onClose();
    }
  };

  const handleAddMetadata = () => {
    if (formData.metadataKey && formData.metadataValue) {
      setMetadata((prev) => ({
        ...prev,
        [formData.metadataKey]: formData.metadataValue,
      }));
      setFormData((prev) => ({
        ...prev,
        metadataKey: "",
        metadataValue: "",
      }));
    }
  };

  const handleRemoveMetadata = (key) => {
    setMetadata((prev) => {
      const newMeta = { ...prev };
      delete newMeta[key];
      return newMeta;
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? "Edit Task" : "Create New Task"}
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
        {isEditing ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(TASK_STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter notes (optional)"
                rows={3}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => handleChange("source", e.target.value)}
                  placeholder="e.g., scanner-01 (optional)"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(TASK_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Channel <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.channel}
                  onChange={(e) => handleChange("channel", e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(TASK_CHANNEL_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target
                </label>
                <input
                  type="text"
                  value={formData.target}
                  onChange={(e) => handleChange("target", e.target.value)}
                  placeholder={
                    formData.channel === "email"
                      ? "user@example.com"
                      : formData.channel === "phone"
                      ? "+1234567890"
                      : "https://example.com"
                  }
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter task title"
                disabled={loading}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter task description (optional)"
                rows={3}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metadata (Optional)
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.metadataKey}
                    onChange={(e) => handleChange("metadataKey", e.target.value)}
                    placeholder="Key (e.g., invoiceId)"
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={formData.metadataValue}
                    onChange={(e) => handleChange("metadataValue", e.target.value)}
                    placeholder="Value (e.g., INV-12345)"
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddMetadata}
                    disabled={
                      loading || !formData.metadataKey || !formData.metadataValue
                    }
                  >
                    Add
                  </Button>
                </div>
                {Object.keys(metadata).length > 0 && (
                  <div className="mt-2 space-y-1">
                    {Object.entries(metadata).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                      >
                        <span className="text-sm">
                          <span className="font-medium">{key}:</span>{" "}
                          {String(value)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMetadata(key)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}

export default CreateTaskModal;
