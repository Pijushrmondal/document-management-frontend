// src/services/metricService.js

import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Metric Service
 * Handles all metrics-related API calls
 */
const metricService = {
    /**
     * Get all metrics
     * @returns {Promise} All metrics
     */
    getAll: async () => {
        const response = await apiService.get(API_ENDPOINTS.METRICS);
        return response;
    },

    /**
     * Get current user's metrics
     * @returns {Promise} User metrics
     */
    getMyMetrics: async () => {
        const response = await apiService.get(API_ENDPOINTS.METRICS_ME);
        return response;
    },

    /**
     * Get document metrics
     * @returns {Promise} Document metrics
     */
    getDocumentMetrics: async () => {
        const response = await apiService.get(API_ENDPOINTS.METRICS_DOCUMENTS);
        return response;
    },

    /**
     * Get action metrics
     * @returns {Promise} Action metrics
     */
    getActionMetrics: async () => {
        const response = await apiService.get(API_ENDPOINTS.METRICS_ACTIONS);
        return response;
    },

    /**
     * Get task metrics
     * @returns {Promise} Task metrics
     */
    getTaskMetrics: async () => {
        const response = await apiService.get(API_ENDPOINTS.METRICS_TASKS);
        return response;
    },

    /**
     * Get webhook metrics
     * @returns {Promise} Webhook metrics
     */
    getWebhookMetrics: async () => {
        const response = await apiService.get(API_ENDPOINTS.METRICS_WEBHOOKS);
        return response;
    },

    /**
     * Get detailed metrics
     * @param {object} params - Query parameters
     * @returns {Promise} Detailed metrics
     */
    getDetailedMetrics: async (params = {}) => {
        const response = await apiService.get(API_ENDPOINTS.METRICS_DETAILED, params);
        return response;
    },
};

export default metricService;