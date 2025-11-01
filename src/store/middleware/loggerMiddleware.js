// src/store/middleware/loggerMiddleware.js

/**
 * Redux middleware to log actions in development
 * Only active in development mode
 */
const loggerMiddleware = (store) => (next) => (action) => {
    // Only log in development
    if (import.meta.env.DEV) {
        console.group(`🔄 Action: ${action.type}`);
        console.log('Prev State:', store.getState());
        console.log('Action:', action);

        const result = next(action);

        console.log('Next State:', store.getState());
        console.groupEnd();

        return result;
    }

    return next(action);
};

export default loggerMiddleware;