// src/pages/Audit.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAuditLogs,
  fetchMyAuditLogs,
  exportAuditLogs,
  selectAuditLogs,
  selectMyAuditLogs,
  selectAuditPagination,
  selectAuditLoading,
  selectAuditExporting,
  selectAuditFilters,
} from "../store/slices/auditSlice";
import { selectUser } from "../store/slices/authSlice";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Pagination from "../components/common/Pagination";
import AuditLogTable from "../components/audit/AuditLogTable";
import AuditStats from "../components/audit/AuditStats";
import AuditFilters from "../components/audit/AuditFilters";
import { USER_ROLES } from "../utils/constants";
import toast from "react-hot-toast";

function Audit() {
  const dispatch = useDispatch();
  const allLogs = useSelector(selectAuditLogs);
  const myLogs = useSelector(selectMyAuditLogs);
  const pagination = useSelector(selectAuditPagination);
  const loading = useSelector(selectAuditLoading);
  const exporting = useSelector(selectAuditExporting);
  const filters = useSelector(selectAuditFilters);
  const user = useSelector(selectUser);

  const [viewMode, setViewMode] = useState("table"); // table or grid
  const [showFilters, setShowFilters] = useState(true);

  const isAdmin = user?.role === USER_ROLES.ADMIN;
  // Use admin logs or user's own logs based on role
  const logs = isAdmin ? allLogs : myLogs;

  useEffect(() => {
    loadLogs(1);
  }, []);

  const loadLogs = (page) => {
    // Build params with proper mapping
    const params = {
      page,
      limit: pagination.limit,
    };
    
    // Map date filters to from/to format
    if (filters.startDate) {
      params.from = filters.startDate;
    }
    if (filters.endDate) {
      params.to = filters.endDate;
    }
    
    // Fetch all logs for admin (with userId filter if provided), or user's own logs for regular users
    if (isAdmin) {
      if (filters.userId) {
        params.userId = filters.userId;
      }
      dispatch(fetchAuditLogs(params));
    } else {
      dispatch(fetchMyAuditLogs(params));
    }
  };

  const handlePageChange = (page) => {
    loadLogs(page);
  };

  const handleApplyFilters = () => {
    loadLogs(1);
  };

  const handleExport = async () => {
    try {
      await dispatch(exportAuditLogs(filters)).unwrap();
      toast.success("Audit logs exported successfully!");
    } catch (error) {
      toast.error("Failed to export audit logs");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="mt-1 text-sm text-gray-600">
            {isAdmin ? "System-wide activity logs" : "Your activity history"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide" : "Show"} Filters
          </Button>
          {/* <Button
            variant="outline"
            icon="📥"
            onClick={handleExport}
            loading={exporting}
            disabled={exporting}
          >
            Export CSV
          </Button> */}
        </div>
      </div>

      {/* Stats */}
      {isAdmin && <AuditStats />}

      {/* Filters */}
      {showFilters && <AuditFilters onApply={handleApplyFilters} />}

      {/* Stats Card */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div>
              <p className="text-sm text-gray-500">Total Logs</p>
              <p className="text-2xl font-semibold text-gray-900">
                {pagination.total}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Page</p>
              <p className="text-2xl font-semibold text-gray-900">
                {pagination.page} / {pagination.totalPages}
              </p>
            </div>
            {Object.values(filters).some((v) => v !== "") && (
              <div>
                <p className="text-sm text-gray-500">Filtered Results</p>
                <p className="text-2xl font-semibold text-blue-600">Active</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Audit Logs Table */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Activity Logs
        </h2>
        <AuditLogTable logs={logs} loading={loading} />
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}
    </div>
  );
}

export default Audit;
