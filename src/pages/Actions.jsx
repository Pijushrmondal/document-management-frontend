import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchActions,
  fetchMonthlyUsage,
  fetchAllTimeUsage,
  selectActions,
  selectActionPagination,
  selectActionLoading,
  selectActionUsage,
} from "../store/slices/actionSlice";
import { selectUser } from "../store/slices/authSlice";
import { Permissions } from "../utils/permissions";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";
import Pagination from "../components/common/Pagination";
import ActionRunner from "../components/actions/ActionRunner";
import ActionHistory from "../components/actions/ActionHistory";
import UsageStats from "../components/actions/UsageStats";

function Actions() {
  const dispatch = useDispatch();
  const actions = useSelector(selectActions);
  const pagination = useSelector(selectActionPagination);
  const loading = useSelector(selectActionLoading);
  const usage = useSelector(selectActionUsage);
  const user = useSelector(selectUser);

  const [showRunner, setShowRunner] = useState(false);

  // Check permissions
  const canRunActions = user && Permissions.canRunActions(user.role);
  const isReadOnly = user && Permissions.isReadOnly(user.role);

  useEffect(() => {
    dispatch(fetchActions({ page: 1, limit: 20 }));
    const now = new Date();
    dispatch(
      fetchMonthlyUsage({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      })
    );
  }, [dispatch]);

  const handlePageChange = (page) => {
    dispatch(fetchActions({ page, limit: pagination.limit }));
  };

  const handleActionSuccess = () => {
    setShowRunner(false);
    dispatch(fetchActions({ page: 1, limit: pagination.limit }));
    const now = new Date();
    dispatch(
      fetchMonthlyUsage({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      })
    );
    dispatch(fetchAllTimeUsage());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Actions</h1>
          <p className="mt-1 text-sm text-gray-600">
            Run AI-powered actions on your documents
          </p>
        </div>
        {canRunActions && (
          <Button
            variant="primary"
            icon="🤖"
            onClick={() => setShowRunner(!showRunner)}
          >
            {showRunner ? "Hide Runner" : "Run Action"}
          </Button>
        )}
        {isReadOnly && (
          <div className="flex items-center px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <span className="text-sm text-yellow-800">
              Read-only access. Cannot run actions.
            </span>
          </div>
        )}
      </div>

      {isReadOnly && (
        <Alert type="warning" title="Read-Only Access">
          Your role ({user?.role}) has read-only access. You can view action history but cannot run new actions.
        </Alert>
      )}

      <UsageStats />

      {showRunner && <ActionRunner onSuccess={handleActionSuccess} />}

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div>
              <p className="text-sm text-gray-500">Total Actions</p>
              <p className="text-2xl font-semibold text-gray-900">
                {usage.monthly?.actionsCount || 0}
              </p>
              {/* {usage.monthly?.period && (
                <p className="text-xs text-gray-400 mt-1">
                  Period: {usage.monthly.period}
                </p>
              )} */}
            </div>
            <div>
              <p className="text-sm text-gray-500">History Items</p>
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
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Action History
        </h2>
        <ActionHistory actions={actions} loading={loading} />
      </div>

      {!loading && actions.length > 0 && pagination.totalPages > 1 && (
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

export default Actions;
