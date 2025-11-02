// src/services/webhookService.js

import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Webhook Service
 * Handles all webhook-related API calls
 */
const webhookService = {
    /**
     * Get all webhooks
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @returns {Promise} Webhooks list
     */
    getAll: async (page = 1, limit = 20) => {
        const response = await apiService.get(API_ENDPOINTS.WEBHOOKS, {
            page,
            limit,
        });
        return response;
    },

    /**
     * Get webhook by ID
     * @param {string} id - Webhook ID
     * @returns {Promise} Webhook object
     */
    getById: async (id) => {
        const response = await apiService.get(`${API_ENDPOINTS.WEBHOOKS}/${id}`);
        return response;
    },

    /**
     * Create webhook
     * @param {object} webhookData - Webhook data
     * @returns {Promise} Created webhook
     */
    create: async (webhookData) => {
        const response = await apiService.post(API_ENDPOINTS.WEBHOOKS, webhookData);
        return response;
    },

    /**
     * Update webhook
     * @param {string} id - Webhook ID
     * @param {object} updates - Webhook updates
     * @returns {Promise} Updated webhook
     */
    update: async (id, updates) => {
        const response = await apiService.put(`${API_ENDPOINTS.WEBHOOKS}/${id}`, updates);
        return response;
    },

    /**
     * Delete webhook
     * @param {string} id - Webhook ID
     * @returns {Promise} Success message
     */
    delete: async (id) => {
        const response = await apiService.delete(`${API_ENDPOINTS.WEBHOOKS}/${id}`);
        return response;
    },

    /**
     * Test webhook
     * @param {string} id - Webhook ID
     * @returns {Promise} Test result
     */
    test: async (id) => {
        const response = await apiService.post(`${API_ENDPOINTS.WEBHOOKS}/${id}/test`);
        return response;
    },

    /**
     * Get webhook statistics
     * @returns {Promise} Webhook stats
     */
    getStats: async () => {
        const response = await apiService.get(API_ENDPOINTS.WEBHOOK_STATS);
        return response;
    },

    /**
     * Regenerate webhook secret
     * @param {string} id - Webhook ID
     * @returns {Promise} Updated webhook with new secret
     */
    regenerateSecret: async (id) => {
        const response = await apiService.post(`${API_ENDPOINTS.WEBHOOKS}/${id}/regenerate-secret`);
        return response;
    },
};

export default webhookService;