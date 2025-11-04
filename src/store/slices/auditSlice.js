import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import auditService from '../../services/auditService';

const initialState = {
    logs: [],
    currentLog: null,
    myLogs: [],
    stats: null,
    pagination: {
        page: 1,
        limit: 15,
        total: 0,
        totalPages: 0,
    },
    filters: {
        userId: '',
        startDate: '',
        endDate: '',
    },
    loading: false,
    exporting: false,
    error: null,
};

export const fetchAuditLogs = createAsyncThunk(
    'audit/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await auditService.getAll(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch audit logs');
        }
    }
);

export const fetchAuditLogById = createAsyncThunk(
    'audit/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await auditService.getById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch audit log');
        }
    }
);

export const fetchMyAuditLogs = createAsyncThunk(
    'audit/fetchMyLogs',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await auditService.getMyLogs(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch your audit logs');
        }
    }
);

export const exportAuditLogs = createAsyncThunk(
    'audit/export',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const response = await auditService.exportLogs(filters);

            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `audit-logs-${new Date().toISOString()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to export audit logs');
        }
    }
);

export const fetchAuditStats = createAsyncThunk(
    'audit/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await auditService.getStats();
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch audit stats');
        }
    }
);

const auditSlice = createSlice({
    name: 'audit',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },

        clearFilters: (state) => {
            state.filters = {
                userId: '',
                startDate: '',
                endDate: '',
            };
        },

        clearCurrentLog: (state) => {
            state.currentLog = null;
        },

        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuditLogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAuditLogs.fulfilled, (state, action) => {
                state.loading = false;
                const logsArray = action.payload.logs ||
                    action.payload.docs ||
                    (Array.isArray(action.payload) ? action.payload : []);
                state.logs = logsArray;
                state.pagination = {
                    page: action.payload.page || 1,
                    limit: action.payload.limit || state.pagination.limit || 15,
                    total: action.payload.total || 0,
                    totalPages: action.payload.totalPages || 1,
                };
            })
            .addCase(fetchAuditLogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchAuditLogById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAuditLogById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentLog = action.payload;
            })
            .addCase(fetchAuditLogById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchMyAuditLogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyAuditLogs.fulfilled, (state, action) => {
                state.loading = false;
                const logsArray = action.payload.logs ||
                    action.payload.docs ||
                    (Array.isArray(action.payload) ? action.payload : []);
                state.myLogs = logsArray;
                state.pagination = {
                    page: action.payload.page || 1,
                    limit: action.payload.limit || state.pagination.limit || 15,
                    total: action.payload.total || 0,
                    totalPages: action.payload.totalPages || 1,
                };
            })
            .addCase(fetchMyAuditLogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(exportAuditLogs.pending, (state) => {
                state.exporting = true;
            })
            .addCase(exportAuditLogs.fulfilled, (state) => {
                state.exporting = false;
            })
            .addCase(exportAuditLogs.rejected, (state, action) => {
                state.exporting = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchAuditStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAuditStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchAuditStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions
export const { setFilters, clearFilters, clearCurrentLog, clearError } = auditSlice.actions;

// Export selectors
export const selectAuditLogs = (state) => state.audit.logs;
export const selectCurrentAuditLog = (state) => state.audit.currentLog;
export const selectMyAuditLogs = (state) => state.audit.myLogs;
export const selectAuditStats = (state) => state.audit.stats;
export const selectAuditPagination = (state) => state.audit.pagination;
export const selectAuditFilters = (state) => state.audit.filters;
export const selectAuditLoading = (state) => state.audit.loading;
export const selectAuditExporting = (state) => state.audit.exporting;
export const selectAuditError = (state) => state.audit.error;

// Export reducer
export default auditSlice.reducer;