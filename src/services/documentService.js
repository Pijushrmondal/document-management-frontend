// src/services/documentService.js

import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Document Service
 * Handles all document-related API calls
 */
const documentService = {
    /**
     * Get all documents with pagination
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @param {string} userId - Optional user ID for admin queries
     * @returns {Promise} Documents list with pagination
     */
    getAll: async (page = 1, limit = 20, userId = null) => {
        const params = {
            page,
            limit,
        };
        
        // Add userId for admin queries
        if (userId) {
            params.userId = userId;
        }
        
        const response = await apiService.get(API_ENDPOINTS.DOCUMENTS, params);
        return response;
    },

    /**
     * Get document by ID
     * @param {string} id - Document ID
     * @returns {Promise} Document object
     */
    getById: async (id) => {
        const response = await apiService.get(`${API_ENDPOINTS.DOCUMENTS}/${id}`);
        return response;
    },

    /**
     * Upload document
     * @param {File} file - File to upload
     * @param {string} primaryTag - Primary tag (folder)
     * @param {array} secondaryTags - Secondary tags
     * @param {function} onUploadProgress - Progress callback
     * @returns {Promise} Uploaded document
     */
    upload: async (file, primaryTag, secondaryTags = [], onUploadProgress = null) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('primaryTag', primaryTag);

        // Add secondary tags
        secondaryTags.forEach((tag) => {
            formData.append('secondaryTags', tag);
        });

        const response = await apiService.upload(
            API_ENDPOINTS.DOCUMENT_UPLOAD,
            formData,
            onUploadProgress
        );
        return response;
    },

    /**
     * Search documents
     * @param {string} query - Search query
     * @param {string} scope - Scope type (folder or files)
     * @param {array} ids - Folder name or file IDs
     * @returns {Promise} Search results
     */
    search: async (query, scope = 'folder', ids = []) => {
        const payload = {
            q: query,
            scope,
            ids: ids,
        };

        const response = await apiService.post(API_ENDPOINTS.DOCUMENT_SEARCH, payload);
        return response;
    },

    /**
     * Download document
     * @param {string} id - Document ID
     * @param {string} filename - Filename to save as
     * @returns {Promise} Downloaded file
     */
    download: async (id, filename) => {
        const url = API_ENDPOINTS.DOCUMENT_DOWNLOAD.replace(':id', id);
        const response = await apiService.download(url, filename);
        return response;
    },

    /**
     * Delete document
     * @param {string} id - Document ID
     * @returns {Promise} Success message
     */
    delete: async (id) => {
        const response = await apiService.delete(`${API_ENDPOINTS.DOCUMENTS}/${id}`);
        return response;
    },

    /**
     * Get documents by folder
     * @param {string} folderName - Folder name
     * @returns {Promise} Documents in folder
     */
    getByFolder: async (folderName) => {
        const url = API_ENDPOINTS.FOLDER_DOCS.replace(':name', folderName);
        const response = await apiService.get(url);
        return response;
    },
};

export default documentService;