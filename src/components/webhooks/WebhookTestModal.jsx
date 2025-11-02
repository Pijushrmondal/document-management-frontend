// src/components/webhooks/WebhookTestModal.jsx

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  testWebhook,
  selectWebhookTesting,
} from "../../store/slices/webhookSlice";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Alert from "../common/Alert";

function WebhookTestModal({ isOpen, onClose, webhook }) {
  const dispatch = useDispatch();
  const testing = useSelector(selectWebhookTesting);
  const [testResult, setTestResult] = useState(null);

  const handleTest = async () => {
    setTestResult(null);
    try {
      const result = await dispatch(testWebhook(webhook.id)).unwrap();
      setTestResult({ success: true, data: result });
    } catch (error) {
      setTestResult({ success: false, error: error.message || "Test failed" });
    }
  };

  const handleClose = () => {
    if (!testing) {
      setTestResult(null);
      onClose();
    }
  };

  if (!webhook) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Test Webhook"
      size="md"
      closeOnOverlayClick={!testing}
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={testing}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleTest}
            loading={testing}
            disabled={testing}
          >
            Send Test Event
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Webhook Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Webhook URL
          </h3>
          <p className="text-sm text-gray-600 font-mono break-all">
            {webhook.url}
          </p>
        </div>

        {/* Test Description */}
        <Alert type="info">
          This will send a test event to your webhook endpoint. Check your
          server logs to verify receipt.
        </Alert>

        {/* Test Result */}
        {testResult && (
          <Alert
            type={testResult.success ? "success" : "error"}
            title={testResult.success ? "Test Successful" : "Test Failed"}
          >
            {testResult.success
              ? "Test event sent successfully. Check your endpoint logs."
              : testResult.error}
          </Alert>
        )}

        {/* Sample Payload */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Sample Payload
          </h3>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs text-green-400 font-mono">
              {`{
  "event": "webhook.test",
  "timestamp": "${new Date().toISOString()}",
  "data": {
    "message": "Test webhook event",
    "webhook_id": "${webhook.id}"
  }
}`}
            </pre>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default WebhookTestModal;
