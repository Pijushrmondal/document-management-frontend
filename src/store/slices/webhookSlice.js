// src/store/slices/webhookSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import webhookService from '../../services/webhookService';
import { SUCCESS_MESSAGES } from '../../utils/constants';
import toast from 'react-hot-toast';

/**
 * Initial state
 */
const initialState = {
    webhooks: [],
    currentWebhook: null,
    stats: null,
    pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    },
    loading: false,
    testing: false,
    error: null,
};

/**
 * Async thunk: Fetch webhooks
 */
export const fetchWebhooks = createAsyncThunk(
    'webhooks/fetchAll',
    async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
        try {
            const response = await webhookService.getAll(page, limit);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch webhooks');
        }
    }
);

/**
 * Async thunk: Fetch webhook by ID
 */
export const fetchWebhookById = createAsyncThunk(
    'webhooks/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await webhookService.getById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch webhook');
        }
    }
);

/**
 * Async thunk: Create webhook
 */
export const createWebhook = createAsyncThunk(
    'webhooks/create',
    async (webhookData, { rejectWithValue }) => {
        try {
            const response = await webhookService.create(webhookData);
            toast.success(SUCCESS_MESSAGES.WEBHOOK_CREATE);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to create webhook');
        }
    }
);

/**
 * Async thunk: Update webhook
 */
export const updateWebhook = createAsyncThunk(
    'webhooks/update',
    async ({ id, updates }, { rejectWithValue }) => {
        try {
            const response = await webhookService.update(id, updates);
            toast.success(SUCCESS_MESSAGES.WEBHOOK_UPDATE);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update webhook');
        }
    }
);

/**
 * Async thunk: Delete webhook
 */
export const deleteWebhook = createAsyncThunk(
    'webhooks/delete',
    async (id, { rejectWithValue }) => {
        try {
            await webhookService.delete(id);
            toast.success(SUCCESS_MESSAGES.WEBHOOK_DELETE);
            return id;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to delete webhook');
        }
    }
);

/**
 * Async thunk: Test webhook
 */
export const testWebhook = createAsyncThunk(
    'webhooks/test',
    async (id, { rejectWithValue }) => {
        try {
            const response = await webhookService.test(id);
            toast.success('Webhook test sent successfully!');
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to test webhook');
        }
    }
);

/**
 * Async thunk: Fetch webhook stats
 */
export const fetchWebhookStats = createAsyncThunk(
    'webhooks/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await webhookService.getStats();
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch webhook stats');
        }
    }
);

/**
 * Async thunk: Regenerate webhook secret
 */
export const regenerateWebhookSecret = createAsyncThunk(
    'webhooks/regenerateSecret',
    async (id, { rejectWithValue }) => {
        try {
            const response = await webhookService.regenerateSecret(id);
            toast.success('Webhook secret regenerated successfully!');
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to regenerate secret');
        }
    }
);

/**
 * Webhook slice
 */
const webhookSlice = createSlice({
    name: 'webhooks',
    initialState,
    reducers: {
        // Clear current webhook
        clearCurrentWebhook: (state) => {
            state.currentWebhook = null;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch webhooks
        builder
            .addCase(fetchWebhooks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWebhooks.fulfilled, (state, action) => {
                state.loading = false;
                const webhooksArray = action.payload.webhooks ||
                    action.payload.docs ||
                    (Array.isArray(action.payload) ? action.payload : []);
                state.webhooks = webhooksArray;
                state.pagination = {
                    page: action.payload.page || 1,
                    limit: action.payload.limit || 20,
                    total: action.payload.total || 0,
                    totalPages: action.payload.totalPages || 1,
                };
            })
            .addCase(fetchWebhooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch webhook by ID
        builder
            .addCase(fetchWebhookById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWebhookById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentWebhook = action.payload;
            })
            .addCase(fetchWebhookById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Create webhook
        builder
            .addCase(createWebhook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createWebhook.fulfilled, (state, action) => {
                state.loading = false;
                state.webhooks.push(action.payload);
            })
            .addCase(createWebhook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update webhook
        builder
            .addCase(updateWebhook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateWebhook.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.webhooks.findIndex(w => w.id === action.payload.id);
                if (index !== -1) {
                    state.webhooks[index] = action.payload;
                }
                if (state.currentWebhook?.id === action.payload.id) {
                    state.currentWebhook = action.payload;
                }
            })
            .addCase(updateWebhook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Delete webhook
        builder
            .addCase(deleteWebhook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteWebhook.fulfilled, (state, action) => {
                state.loading = false;
                state.webhooks = state.webhooks.filter(w => w.id !== action.payload);
            })
            .addCase(deleteWebhook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Test webhook
        builder
            .addCase(testWebhook.pending, (state) => {
                state.testing = true;
            })
            .addCase(testWebhook.fulfilled, (state) => {
                state.testing = false;
            })
            .addCase(testWebhook.rejected, (state, action) => {
                state.testing = false;
                state.error = action.payload;
            });

        // Fetch webhook stats
        builder
            .addCase(fetchWebhookStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWebhookStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchWebhookStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Regenerate secret
        builder
            .addCase(regenerateWebhookSecret.fulfilled, (state, action) => {
                const index = state.webhooks.findIndex(w => w.id === action.payload.id);
                if (index !== -1) {
                    state.webhooks[index] = action.payload;
                }
                if (state.currentWebhook?.id === action.payload.id) {
                    state.currentWebhook = action.payload;
                }
            });
    },
});

// Export actions
export const { clearCurrentWebhook, clearError } = webhookSlice.actions;

// Export selectors
export const selectWebhooks = (state) => state.webhooks.webhooks;
export const selectCurrentWebhook = (state) => state.webhooks.currentWebhook;
export const selectWebhookStats = (state) => state.webhooks.stats;
export const selectWebhookPagination = (state) => state.webhooks.pagination;
export const selectWebhookLoading = (state) => state.webhooks.loading;
export const selectWebhookTesting = (state) => state.webhooks.testing;
export const selectWebhookError = (state) => state.webhooks.error;

// Export reducer
export default webhookSlice.reducer;