// src/store/slices/uiSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../utils/constants';
import { getFromStorage, saveToStorage } from '../../utils/helpers';

/**
 * Initial state
 */
const initialState = {
    sidebarOpen: getFromStorage(STORAGE_KEYS.SIDEBAR) !== false, // Default true
    theme: getFromStorage(STORAGE_KEYS.THEME) || 'light',
    activeModal: null,
    breadcrumbs: [],
};

/**
 * UI slice
 */
const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        // Toggle sidebar
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
            saveToStorage(STORAGE_KEYS.SIDEBAR, state.sidebarOpen);
        },

        // Set sidebar state
        setSidebarOpen: (state, action) => {
            state.sidebarOpen = action.payload;
            saveToStorage(STORAGE_KEYS.SIDEBAR, action.payload);
        },

        // Set theme
        setTheme: (state, action) => {
            state.theme = action.payload;
            saveToStorage(STORAGE_KEYS.THEME, action.payload);
        },

        // Open modal
        openModal: (state, action) => {
            state.activeModal = action.payload;
        },

        // Close modal
        closeModal: (state) => {
            state.activeModal = null;
        },

        // Set breadcrumbs
        setBreadcrumbs: (state, action) => {
            state.breadcrumbs = action.payload;
        },
    },
});

// Export actions
export const {
    toggleSidebar,
    setSidebarOpen,
    setTheme,
    openModal,
    closeModal,
    setBreadcrumbs,
} = uiSlice.actions;

// Export selectors
export const selectUI = (state) => state.ui;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectTheme = (state) => state.ui.theme;
export const selectActiveModal = (state) => state.ui.activeModal;
export const selectBreadcrumbs = (state) => state.ui.breadcrumbs;

// Export reducer
export default uiSlice.reducer;