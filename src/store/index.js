// src/store/index.js

import { configureStore } from '@reduxjs/toolkit';
import errorMiddleware from './middleware/errorMiddleware';
import loggerMiddleware from './middleware/loggerMiddleware';

// Import reducers
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

/**
 * Configure Redux store
 */
const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        // Add more reducers as we create them
        // documents: documentReducer,
        // tags: tagReducer,
        // actions: actionReducer,
        // tasks: taskReducer,
        // webhooks: webhookReducer,
        // audit: auditReducer,
        // metrics: metricsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types for serializable check
                ignoredActions: ['ui/openModal'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.timestamp', 'meta.arg'],
                // Ignore these paths in the state
                ignoredPaths: ['ui.modals'],
            },
        })
            .concat(errorMiddleware)
            .concat(import.meta.env.DEV ? loggerMiddleware : []),
    devTools: import.meta.env.DEV,
});

export default store;