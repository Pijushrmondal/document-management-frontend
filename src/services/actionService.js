// src/services/actionService.js

import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Action Service
 * Handles all action-related API calls
 */
const actionService = {
    /**
     * Run action
     * @param {object} scope - Scope object { type: 'folder' | 'files', name?: string, ids?: array }
     * @param {array} messages - Chat messages
     * @param {array} actions - Action types to run
     * @returns {Promise} Action result
     */
    runAction: async (scope, messages, actions) => {
        const response = await apiService.post(API_ENDPOINTS.ACTION_RUN, {
            scope,
            messages,
            actions,
        });
        return response;
    },

    /**
     * Get all actions (history)
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @returns {Promise} Actions list
     */
    getAll: async (page = 1, limit = 20) => {
        const response = await apiService.get(API_ENDPOINTS.ACTIONS, {
            page,
            limit,
        });
        return response;
    },

    /**
     * Get action by ID
     * @param {string} id - Action ID
     * @returns {Promise} Action object
     */
    getById: async (id) => {
        const response = await apiService.get(`${API_ENDPOINTS.ACTIONS}/${id}`);
        return response;
    },

    /**
     * Get monthly usage
     * @param {number} year - Year
     * @param {number} month - Month (1-12)
     * @returns {Promise} Usage statistics
     */
    getMonthlyUsage: async (year, month) => {
        const response = await apiService.get(API_ENDPOINTS.ACTION_USAGE_MONTH, {
            year,
            month,
        });
        return response;
    },

    /**
     * Get all-time usage
     * @returns {Promise} Usage statistics
     */
    getAllTimeUsage: async () => {
        const response = await apiService.get(API_ENDPOINTS.ACTION_USAGE_ALL);
        return response;
    },
};

export default actionService;