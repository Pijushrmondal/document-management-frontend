// src/services/taskService.js

import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Task Service
 * Handles all task-related API calls
 */
const taskService = {
    /**
     * Get all tasks
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @returns {Promise} Tasks list
     */
    getAll: async (page = 1, limit = 50) => {
        const response = await apiService.get(API_ENDPOINTS.TASKS, {
            page,
            limit,
        });
        return response;
    },

    /**
     * Get task by ID
     * @param {string} id - Task ID
     * @returns {Promise} Task object
     */
    getById: async (id) => {
        const response = await apiService.get(`${API_ENDPOINTS.TASKS}/${id}`);
        return response;
    },

    /**
     * Create task
     * @param {object} taskData - Task data
     * @returns {Promise} Created task
     */
    create: async (taskData) => {
        const response = await apiService.post(API_ENDPOINTS.TASKS, taskData);
        return response;
    },

    /**
     * Update task
     * @param {string} id - Task ID
     * @param {object} updates - Task updates
     * @returns {Promise} Updated task
     */
    update: async (id, updates) => {
        const response = await apiService.put(`${API_ENDPOINTS.TASKS}/${id}`, updates);
        return response;
    },

    /**
     * Update task status
     * @param {string} id - Task ID
     * @param {string} status - New status
     * @returns {Promise} Updated task
     */
    updateStatus: async (id, status) => {
        const response = await apiService.patch(`${API_ENDPOINTS.TASKS}/${id}/status`, {
            status,
        });
        return response;
    },

    /**
     * Delete task
     * @param {string} id - Task ID
     * @returns {Promise} Success message
     */
    delete: async (id) => {
        const response = await apiService.delete(`${API_ENDPOINTS.TASKS}/${id}`);
        return response;
    },

    /**
     * Get today's tasks
     * @returns {Promise} Today's tasks
     */
    getToday: async () => {
        const response = await apiService.get(API_ENDPOINTS.TASK_TODAY);
        return response;
    },

    /**
     * Get overdue tasks
     * @returns {Promise} Overdue tasks
     */
    getOverdue: async () => {
        const response = await apiService.get(API_ENDPOINTS.TASK_OVERDUE);
        return response;
    },


};

export default taskService;