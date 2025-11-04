// src/components/audit/AuditFilters.jsx

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilters,
  clearFilters,
  selectAuditFilters,
} from "../../store/slices/auditSlice";
import Button from "../common/Button";

function AuditFilters({ onApply }) {
  const dispatch = useDispatch();
  const currentFilters = useSelector(selectAuditFilters);

  const [localFilters, setLocalFilters] = useState(currentFilters);

  const handleChange = (field, value) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    dispatch(setFilters(localFilters));
    if (onApply) onApply(localFilters);
  };

  const handleClear = () => {
    const emptyFilters = {
      userId: "",
      startDate: "",
      endDate: "",
    };
    setLocalFilters(emptyFilters);
    dispatch(clearFilters());
    if (onApply) onApply(emptyFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some((v) => v !== "");

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* User ID Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            User ID
          </label>
          <input
            type="text"
            value={localFilters.userId}
            onChange={(e) => handleChange("userId", e.target.value)}
            placeholder="Filter by user..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Start Date Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={localFilters.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* End Date Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={localFilters.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Apply Button */}
      <div className="flex justify-end">
        <Button variant="primary" onClick={handleApply}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}

export default AuditFilters;
