// src/store/index.js

import { configureStore } from '@reduxjs/toolkit';
import errorMiddleware from './middleware/errorMiddleware';
import loggerMiddleware from './middleware/loggerMiddleware';

// Import reducers
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import documentReducer from './slices/documentSlice';
import tagReducer from './slices/tagSlice';

/**
 * Configure Redux store
 */
const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        documents: documentReducer,
        tags: tagReducer,
        // Add more reducers as we create them
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
                ignoredActions: ['ui/openModal', 'documents/uploadDocument/pending'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.timestamp', 'meta.arg', 'payload.file'],
                // Ignore these paths in the state
                ignoredPaths: ['ui.modals', 'documents.uploadProgress'],
            },
        })
            .concat(errorMiddleware)
            .concat(import.meta.env.DEV ? loggerMiddleware : []),
    devTools: import.meta.env.DEV,
});

export default store;