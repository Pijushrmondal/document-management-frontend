// src/components/actions/ActionRunner.jsx

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { runAction, selectActionRunning } from "../../store/slices/actionSlice";
import { fetchFolders } from "../../store/slices/tagSlice";
import { fetchDocuments } from "../../store/slices/documentSlice";
import Card from "../common/Card";
import Button from "../common/Button";
import Alert from "../common/Alert";
import ScopeSelector from "./ScopeSelector";
import { validateActionScope } from "../../utils/validators";
import { ACTION_TYPES, ACTION_TYPE_LABELS } from "../../utils/constants";
import config from "../../config/config";

function ActionRunner({ onSuccess }) {
  const dispatch = useDispatch();
  const running = useSelector(selectActionRunning);

  const [scope, setScope] = useState({ type: "folder", name: "" });
  const [message, setMessage] = useState("");
  const [selectedActions, setSelectedActions] = useState(["make_csv"]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Load folders and documents
    dispatch(fetchFolders());
    dispatch(fetchDocuments({ page: 1, limit: 100 }));
  }, [dispatch]);

  const handleActionToggle = (actionType) => {
    setSelectedActions((prev) =>
      prev.includes(actionType)
        ? prev.filter((a) => a !== actionType)
        : [...prev, actionType]
    );
  };

  const validate = () => {
    const newErrors = {};

    // Validate scope
    const scopeValidation = validateActionScope(scope);
    if (!scopeValidation.valid) {
      newErrors.scope = scopeValidation.error;
    }

    // Validate message
    if (!message.trim()) {
      newErrors.message = "Please enter a message or instruction";
    }

    // Validate actions
    if (selectedActions.length === 0) {
      newErrors.actions = "Please select at least one action type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const actionPayload = {
        scope,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        actions: selectedActions,
      };

      await dispatch(runAction(actionPayload)).unwrap();

      // Reset form
      setMessage("");
      setErrors({});

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const creditCost = selectedActions.length * config.action.creditCost;

  return (
    <Card title="Run AI Action" subtitle="Execute actions on your documents">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Scope Selector */}
        <div>
          <ScopeSelector scope={scope} onScopeChange={setScope} />
          {errors.scope && (
            <p className="mt-2 text-sm text-red-600">{errors.scope}</p>
          )}
        </div>

        {/* Message Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instructions <span className="text-red-500">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setErrors((prev) => ({ ...prev, message: "" }));
            }}
            placeholder="e.g., Make a CSV of vendor totals from these invoices"
            rows={4}
            disabled={running}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.message ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Describe what you want the AI to do with the selected documents
          </p>
        </div>

        {/* Action Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Action Types <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(ACTION_TYPES).map(([key, value]) => (
              <label
                key={key}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedActions.includes(value)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedActions.includes(value)}
                  onChange={() => handleActionToggle(value)}
                  disabled={running}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    {ACTION_TYPE_LABELS[value]}
                  </div>
                  <div className="text-xs text-gray-500">
                    {value === "make_csv"
                      ? "Generate CSV summary"
                      : "Generate analysis document"}
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.actions && (
            <p className="mt-2 text-sm text-red-600">{errors.actions}</p>
          )}
        </div>

        {/* Credit Cost */}
        <Alert type="info">
          <div className="flex items-center justify-between">
            <span>Credit Cost:</span>
            <span className="font-semibold">{creditCost} credits</span>
          </div>
          <p className="text-xs mt-1">
            Each action costs {config.action.creditCost} credits
          </p>
        </Alert>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            icon="🤖"
            loading={running}
            disabled={running}
          >
            {running ? "Running Action..." : "Run Action"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default ActionRunner;
