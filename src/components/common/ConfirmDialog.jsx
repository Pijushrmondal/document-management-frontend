// src/components/common/ConfirmDialog.jsx

import Modal from "./Modal";
import Button from "./Button";

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
  loading = false,
}) {
  const handleConfirm = async () => {
    try {
    await onConfirm();
      // Only close if onConfirm doesn't throw an error
      // Parent component should handle closing on success
    onClose();
    } catch (error) {
      // Don't close dialog on error - let parent handle it
      // Error is likely already handled by the parent component
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-gray-600">{message}</p>
    </Modal>
  );
}

export default ConfirmDialog;
