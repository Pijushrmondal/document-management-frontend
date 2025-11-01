// src/services/tagService.js

import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Tag Service
 * Handles all tag-related API calls
 */
const tagService = {
    /**
     * Get all tags
     * @returns {Promise} Tags list
     */
    getAll: async () => {
        const response = await apiService.get(API_ENDPOINTS.TAGS);
        return response;
    },

    /**
     * Get tag by ID
     * @param {string} id - Tag ID
     * @returns {Promise} Tag object
     */
    getById: async (id) => {
        const response = await apiService.get(`${API_ENDPOINTS.TAGS}/${id}`);
        return response;
    },

    /**
     * Create tag
     * @param {string} name - Tag name
     * @returns {Promise} Created tag
     */
    create: async (name) => {
        const response = await apiService.post(API_ENDPOINTS.TAGS, { name });
        return response;
    },

    /**
     * Delete tag
     * @param {string} id - Tag ID
     * @returns {Promise} Success message
     */
    delete: async (id) => {
        const response = await apiService.delete(`${API_ENDPOINTS.TAGS}/${id}`);
        return response;
    },

    /**
     * Get all folders (tags used as primary tags)
     * @returns {Promise} Folders list with document counts
     */
    getFolders: async () => {
        const response = await apiService.get(API_ENDPOINTS.FOLDERS);
        return response;
    },

    /**
     * Get documents in a folder
     * @param {string} folderName - Folder name
     * @returns {Promise} Documents in folder
     */
    getFolderDocuments: async (folderName) => {
        const url = API_ENDPOINTS.FOLDER_DOCS.replace(':name', folderName);
        const response = await apiService.get(url);
        return response;
    },
};

export default tagService;