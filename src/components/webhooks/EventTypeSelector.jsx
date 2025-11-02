// src/components/webhooks/EventTypeSelector.jsx

import {
  WEBHOOK_EVENT_TYPES,
  WEBHOOK_EVENT_TYPE_LABELS,
  WEBHOOK_EVENT_TYPE_DESCRIPTIONS,
} from "../../utils/constants";

function EventTypeSelector({
  selectedEvents = [],
  onEventsChange,
  label = "Event Types",
  disabled = false,
}) {
  const handleToggle = (eventType) => {
    if (selectedEvents.includes(eventType)) {
      onEventsChange(selectedEvents.filter((e) => e !== eventType));
    } else {
      onEventsChange([...selectedEvents, eventType]);
    }
  };

  const handleSelectAll = () => {
    onEventsChange(Object.values(WEBHOOK_EVENT_TYPES));
  };

  const handleDeselectAll = () => {
    onEventsChange([]);
  };

  const allSelected =
    selectedEvents.length === Object.values(WEBHOOK_EVENT_TYPES).length;

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {label} <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={allSelected ? handleDeselectAll : handleSelectAll}
              disabled={disabled}
              className="text-xs text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              {allSelected ? "Deselect All" : "Select All"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
        {Object.entries(WEBHOOK_EVENT_TYPES).map(([key, value]) => (
          <label
            key={value}
            className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedEvents.includes(value)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input
              type="checkbox"
              checked={selectedEvents.includes(value)}
              onChange={() => handleToggle(value)}
              disabled={disabled}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            />
            <div className="ml-3 flex-1">
              <div className="text-sm font-medium text-gray-900">
                {WEBHOOK_EVENT_TYPE_LABELS[value]}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {WEBHOOK_EVENT_TYPE_DESCRIPTIONS[value]}
              </div>
            </div>
          </label>
        ))}
      </div>

      {selectedEvents.length > 0 && (
        <p className="text-xs text-gray-600">
          {selectedEvents.length} event{selectedEvents.length !== 1 ? "s" : ""}{" "}
          selected
        </p>
      )}
    </div>
  );
}

export default EventTypeSelector;
