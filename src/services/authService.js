// src/services/authService.js

import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Authentication Service
 * Handles all auth-related API calls
 */
const authService = {
    /**
     * Login user (Mock JWT authentication)
     * @param {string} email - User email
     * @param {string} role - User role (admin, support, moderator, user)
     * @returns {Promise} Login response with token and user
     */
    login: async (email, role) => {
        const response = await apiService.post(API_ENDPOINTS.LOGIN, {
            email,
            role,
        });
        return response;
    },

    /**
     * Get current user details
     * @returns {Promise} User object
     */
    getCurrentUser: async () => {
        const response = await apiService.get(API_ENDPOINTS.ME);
        return response;
    },

    /**
     * Logout user (client-side only)
     * @returns {Promise} Success message
     */
    logout: async () => {
        // Since it's mock auth, just return success
        // In real app, you might call an API endpoint to invalidate token
        return Promise.resolve({ message: 'Logged out successfully' });
    },
};

export default authService;