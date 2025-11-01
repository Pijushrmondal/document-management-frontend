// src/store/slices/actionSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import actionService from '../../services/actionService';
import { SUCCESS_MESSAGES } from '../../utils/constants';
import toast from 'react-hot-toast';

/**
 * Initial state
 */
const initialState = {
    actions: [],
    currentAction: null,
    usage: {
        monthly: null,
        allTime: null,
    },
    pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    },
    loading: false,
    running: false,
    error: null,
};

/**
 * Async thunk: Run action
 */
export const runAction = createAsyncThunk(
    'actions/run',
    async ({ scope, messages, actions }, { rejectWithValue }) => {
        try {
            const response = await actionService.runAction(scope, messages, actions);
            toast.success(SUCCESS_MESSAGES.ACTION_RUN);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to run action');
        }
    }
);

/**
 * Async thunk: Fetch actions
 */
export const fetchActions = createAsyncThunk(
    'actions/fetchAll',
    async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
        try {
            const response = await actionService.getAll(page, limit);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch actions');
        }
    }
);

/**
 * Async thunk: Fetch action by ID
 */
export const fetchActionById = createAsyncThunk(
    'actions/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await actionService.getById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch action');
        }
    }
);

/**
 * Async thunk: Fetch monthly usage
 */
export const fetchMonthlyUsage = createAsyncThunk(
    'actions/fetchMonthlyUsage',
    async ({ year, month }, { rejectWithValue }) => {
        try {
            const response = await actionService.getMonthlyUsage(year, month);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch monthly usage');
        }
    }
);

/**
 * Async thunk: Fetch all-time usage
 */
export const fetchAllTimeUsage = createAsyncThunk(
    'actions/fetchAllTimeUsage',
    async (_, { rejectWithValue }) => {
        try {
            const response = await actionService.getAllTimeUsage();
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch all-time usage');
        }
    }
);

/**
 * Action slice
 */
const actionSlice = createSlice({
    name: 'actions',
    initialState,
    reducers: {
        // Clear current action
        clearCurrentAction: (state) => {
            state.currentAction = null;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Run action
        builder
            .addCase(runAction.pending, (state) => {
                state.running = true;
                state.error = null;
            })
            .addCase(runAction.fulfilled, (state, action) => {
                state.running = false;
                state.actions.unshift(action.payload);
            })
            .addCase(runAction.rejected, (state, action) => {
                state.running = false;
                state.error = action.payload;
            });

        // Fetch actions
        builder
            .addCase(fetchActions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActions.fulfilled, (state, action) => {
                state.loading = false;
                const actionsArray = action.payload.actions ||
                    action.payload.docs ||
                    (Array.isArray(action.payload) ? action.payload : []);
                state.actions = actionsArray;
                state.pagination = {
                    page: action.payload.page || 1,
                    limit: action.payload.limit || 20,
                    total: action.payload.total || 0,
                    totalPages: action.payload.totalPages || 1,
                };
            })
            .addCase(fetchActions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch action by ID
        builder
            .addCase(fetchActionById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActionById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentAction = action.payload;
            })
            .addCase(fetchActionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch monthly usage
        builder
            .addCase(fetchMonthlyUsage.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMonthlyUsage.fulfilled, (state, action) => {
                state.loading = false;
                state.usage.monthly = action.payload;
            })
            .addCase(fetchMonthlyUsage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch all-time usage
        builder
            .addCase(fetchAllTimeUsage.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllTimeUsage.fulfilled, (state, action) => {
                state.loading = false;
                state.usage.allTime = action.payload;
            })
            .addCase(fetchAllTimeUsage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions
export const { clearCurrentAction, clearError } = actionSlice.actions;

// Export selectors
export const selectActions = (state) => state.actions.actions;
export const selectCurrentAction = (state) => state.actions.currentAction;
export const selectActionUsage = (state) => state.actions.usage;
export const selectActionPagination = (state) => state.actions.pagination;
export const selectActionLoading = (state) => state.actions.loading;
export const selectActionRunning = (state) => state.actions.running;
export const selectActionError = (state) => state.actions.error;

// Export reducer
export default actionSlice.reducer;
