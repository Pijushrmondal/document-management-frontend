// src/store/middleware/errorMiddleware.js

import toast from 'react-hot-toast';

/**
 * Redux middleware to handle errors globally
 * Catches rejected actions and shows toast notifications
 */
const errorMiddleware = () => (next) => (action) => {
    // Check if action is a rejected thunk
    if (action.type && action.type.endsWith('/rejected')) {
        const error = action.payload || action.error;

        // Extract error message
        let errorMessage = 'An unexpected error occurred';

        if (error) {
            if (typeof error === 'string') {
                errorMessage = error;
            } else if (error.message) {
                errorMessage = error.message;
            } else if (error.error) {
                errorMessage = error.error;
            }
        }

        // Show error toast
        toast.error(errorMessage, {
            duration: 4000,
            position: 'top-right',
        });

        // Log error in development
        if (import.meta.env.DEV) {
            console.error('Redux Error:', {
                action: action.type,
                error: error,
                message: errorMessage,
            });
        }
    }

    return next(action);
};

export default errorMiddleware;