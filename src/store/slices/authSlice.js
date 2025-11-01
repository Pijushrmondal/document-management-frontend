// src/store/slices/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import apiService from '../../services/api';
import { STORAGE_KEYS, SUCCESS_MESSAGES } from '../../utils/constants';
import { saveToStorage, removeFromStorage, getFromStorage } from '../../utils/helpers';
import toast from 'react-hot-toast';

/**
 * Initial state
 */
const initialState = {
    user: getFromStorage(STORAGE_KEYS.USER) || null,
    token: getFromStorage(STORAGE_KEYS.TOKEN) || null,
    isAuthenticated: !!getFromStorage(STORAGE_KEYS.TOKEN),
    loading: false,
    error: null,
};

/**
 * Async thunk: Login user
 */
export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, role }, { rejectWithValue }) => {
        try {
            const response = await authService.login(email, role);

            // Save token and user to localStorage
            saveToStorage(STORAGE_KEYS.TOKEN, response.access_token);
            saveToStorage(STORAGE_KEYS.USER, response.user);

            // Set token in API service
            apiService.setAuthToken(response.access_token);

            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

/**
 * Async thunk: Get current user
 */
export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.getCurrentUser();

            // Update user in localStorage
            saveToStorage(STORAGE_KEYS.USER, response);

            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to get user');
        }
    }
);

/**
 * Auth slice
 */
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Logout user
        logoutUser: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;

            // Clear storage
            removeFromStorage(STORAGE_KEYS.TOKEN);
            removeFromStorage(STORAGE_KEYS.USER);

            // Clear API token
            apiService.clearAuthToken();

            // Show success message
            toast.success(SUCCESS_MESSAGES.LOGOUT);
        },

        // Set user (for manual updates)
        setUser: (state, action) => {
            state.user = action.payload;
            saveToStorage(STORAGE_KEYS.USER, action.payload);
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Login user
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.access_token;
                state.isAuthenticated = true;
                state.error = null;

                // Show success message
                toast.success(SUCCESS_MESSAGES.LOGIN);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            });

        // Get current user
        builder
            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions
export const { logoutUser, setUser, clearError } = authSlice.actions;

// Export selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// Export reducer
export default authSlice.reducer;