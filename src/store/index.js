// src/store/index.js

import { configureStore } from '@reduxjs/toolkit';
import errorMiddleware from './middleware/errorMiddleware';
import loggerMiddleware from './middleware/loggerMiddleware';

// Import slices (we'll create these in next sessions)
// import authReducer from './slices/authSlice';
// import documentReducer from './slices/documentSlice';
// import tagReducer from './slices/tagSlice';
// import actionReducer from './slices/actionSlice';
// import taskReducer from './slices/taskSlice';
// import webhookReducer from './slices/webhookSlice';
// import auditReducer from './slices/auditSlice';
// import metricsReducer from './slices/metricsSlice';
// import uiReducer from './slices/uiSlice';

/**
 * Configure Redux store
 */
const store = configureStore({
    reducer: {
        // Add reducers here as we create them
        // auth: authReducer,
        // documents: documentReducer,
        // tags: tagReducer,
        // actions: actionReducer,
        // tasks: taskReducer,
        // webhooks: webhookReducer,
        // audit: auditReducer,
        // metrics: metricsReducer,
        // ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types for serializable check
                ignoredActions: ['ui/openModal', 'ui/addToast'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.timestamp', 'meta.arg'],
                // Ignore these paths in the state
                ignoredPaths: ['ui.modals', 'documents.uploadProgress'],
            },
        })
            .concat(errorMiddleware)
            .concat(import.meta.env.DEV ? loggerMiddleware : []),
    devTools: import.meta.env.DEV,
});

export default store;