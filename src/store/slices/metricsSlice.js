// src/store/slices/metricSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import metricService from '../../services/metricsService';

/**
 * Initial state
 */
const initialState = {
    allMetrics: null,
    myMetrics: null,
    documentMetrics: null,
    actionMetrics: null,
    taskMetrics: null,
    webhookMetrics: null,
    detailedMetrics: null,
    loading: false,
    error: null,
};

/**
 * Async thunk: Fetch all metrics
 */
export const fetchAllMetrics = createAsyncThunk(
    'metrics/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await metricService.getAll();
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch metrics');
        }
    }
);

/**
 * Async thunk: Fetch my metrics
 */
export const fetchMyMetrics = createAsyncThunk(
    'metrics/fetchMy',
    async (_, { rejectWithValue }) => {
        try {
            const response = await metricService.getMyMetrics();
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch your metrics');
        }
    }
);

/**
 * Async thunk: Fetch document metrics
 */
export const fetchDocumentMetrics = createAsyncThunk(
    'metrics/fetchDocuments',
    async (_, { rejectWithValue }) => {
        try {
            const response = await metricService.getDocumentMetrics();
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch document metrics');
        }
    }
);

/**
 * Async thunk: Fetch action metrics
 */
export const fetchActionMetrics = createAsyncThunk(
    'metrics/fetchActions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await metricService.getActionMetrics();
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch action metrics');
        }
    }
);

/**
 * Async thunk: Fetch task metrics
 */
export const fetchTaskMetrics = createAsyncThunk(
    'metrics/fetchTasks',
    async (_, { rejectWithValue }) => {
        try {
            const response = await metricService.getTaskMetrics();
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch task metrics');
        }
    }
);

/**
 * Async thunk: Fetch webhook metrics
 */
export const fetchWebhookMetrics = createAsyncThunk(
    'metrics/fetchWebhooks',
    async (_, { rejectWithValue }) => {
        try {
            const response = await metricService.getWebhookMetrics();
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch webhook metrics');
        }
    }
);

/**
 * Async thunk: Fetch detailed metrics
 */
export const fetchDetailedMetrics = createAsyncThunk(
    'metrics/fetchDetailed',
    async (params, { rejectWithValue }) => {
        try {
            const response = await metricService.getDetailedMetrics(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch detailed metrics');
        }
    }
);

/**
 * Metric slice
 */
const metricSlice = createSlice({
    name: 'metrics',
    initialState,
    reducers: {
        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Reset metrics
        resetMetrics: (state) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        // Fetch all metrics
        builder
            .addCase(fetchAllMetrics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllMetrics.fulfilled, (state, action) => {
                state.loading = false;
                state.allMetrics = action.payload;
            })
            .addCase(fetchAllMetrics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch my metrics
        builder
            .addCase(fetchMyMetrics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyMetrics.fulfilled, (state, action) => {
                state.loading = false;
                state.myMetrics = action.payload;
            })
            .addCase(fetchMyMetrics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch document metrics
        builder
            .addCase(fetchDocumentMetrics.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDocumentMetrics.fulfilled, (state, action) => {
                state.loading = false;
                state.documentMetrics = action.payload;
            })
            .addCase(fetchDocumentMetrics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch action metrics
        builder
            .addCase(fetchActionMetrics.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchActionMetrics.fulfilled, (state, action) => {
                state.loading = false;
                state.actionMetrics = action.payload;
            })
            .addCase(fetchActionMetrics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch task metrics
        builder
            .addCase(fetchTaskMetrics.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTaskMetrics.fulfilled, (state, action) => {
                state.loading = false;
                state.taskMetrics = action.payload;
            })
            .addCase(fetchTaskMetrics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch webhook metrics
        builder
            .addCase(fetchWebhookMetrics.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWebhookMetrics.fulfilled, (state, action) => {
                state.loading = false;
                state.webhookMetrics = action.payload;
            })
            .addCase(fetchWebhookMetrics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch detailed metrics
        builder
            .addCase(fetchDetailedMetrics.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDetailedMetrics.fulfilled, (state, action) => {
                state.loading = false;
                state.detailedMetrics = action.payload;
            })
            .addCase(fetchDetailedMetrics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions
export const { clearError, resetMetrics } = metricSlice.actions;

// Export selectors
export const selectAllMetrics = (state) => state.metrics.allMetrics;
export const selectMyMetrics = (state) => state.metrics.myMetrics;
export const selectDocumentMetrics = (state) => state.metrics.documentMetrics;
export const selectActionMetrics = (state) => state.metrics.actionMetrics;
export const selectTaskMetrics = (state) => state.metrics.taskMetrics;
export const selectWebhookMetrics = (state) => state.metrics.webhookMetrics;
export const selectDetailedMetrics = (state) => state.metrics.detailedMetrics;
export const selectMetricLoading = (state) => state.metrics.loading;
export const selectMetricError = (state) => state.metrics.error;

// Export reducer
export default metricSlice.reducer;