// src/services/auditService.js

import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Audit Service
 * Handles all audit-related API calls
 */
const auditService = {
    /**
     * Get all audit logs (for admin - filtered by user)
     * @param {object} params - Query parameters { userId, page, limit, from, to }
     * @returns {Promise} Audit logs list
     */
    getAll: async (params = {}) => {
        // If userId is provided, use /audit/user/:userId endpoint
        if (params.userId) {
            const { userId, ...queryParams } = params;
            // Remove userId from query params since it's in the URL path
            const url = `${API_ENDPOINTS.AUDIT}/user/${userId}`;
            return apiService.get(url, queryParams);
        }
        // Otherwise use default audit endpoint (if it exists)
        // For now, default to /audit/me for non-admin or fallback
        const response = await apiService.get(API_ENDPOINTS.AUDIT_ME, params);
        return response;
    },

    /**
     * Get audit log by ID
     * @param {string} id - Audit log ID
     * @returns {Promise} Audit log object
     */
    getById: async (id) => {
        const response = await apiService.get(`${API_ENDPOINTS.AUDIT}/${id}`);
        return response;
    },

    /**
     * Get current user's audit logs
     * @param {object} params - Query parameters { page, limit, from, to }
     * @returns {Promise} User's audit logs
     */
    getMyLogs: async (params = {}) => {
        // Map startDate/endDate to from/to if needed
        const queryParams = { ...params };
        if (params.startDate) {
            queryParams.from = params.startDate;
            delete queryParams.startDate;
        }
        if (params.endDate) {
            queryParams.to = params.endDate;
            delete queryParams.endDate;
        }
        const response = await apiService.get(API_ENDPOINTS.AUDIT_ME, queryParams);
        return response;
    },

    /**
     * Export audit logs
     * @param {object} filters - Filter parameters
     * @returns {Promise} CSV file download
     */
    exportLogs: async (filters = {}) => {
        const response = await apiService.get(`${API_ENDPOINTS.AUDIT}/export`, filters, {
            responseType: 'blob',
        });
        return response;
    },

    /**
     * Get audit statistics
     * @returns {Promise} Audit stats
     */
    getStats: async () => {
        const response = await apiService.get(`${API_ENDPOINTS.AUDIT}/stats`);
        return response;
    },
};

export default auditService;