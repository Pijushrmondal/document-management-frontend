// src/services/api.js

import axios from "axios";
import config from "../config/config";
import { STORAGE_KEYS, ERROR_MESSAGES } from "../utils/constants";
import {
    isTokenExpired,
    getFromStorage,
    removeFromStorage,
} from "../utils/helpers";

/**
 * Create axios instance with default config
 */
const api = axios.create({
    baseURL: config.api.baseUrl,
    timeout: config.api.timeout,
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Request interceptor - Add auth token to requests
 */
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = getFromStorage(STORAGE_KEYS.TOKEN);

        // Add token to headers if exists and not expired
        if (token && !isTokenExpired(token)) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (import.meta.env.DEV && config.dev?.enableLogger) {
            console.log("🚀 API Request:", {
                method: config.method.toUpperCase(),
                url: config.url,
                data: config.data,
                params: config.params,
            });
        }

        return config;
    },
    (error) => {
        console.error("❌ Request Error:", error);
        return Promise.reject(error);
    }
);

/**
 * Response interceptor - Handle responses and errors
 */
api.interceptors.response.use(
    (response) => {
        // Log response in development
        if (import.meta.env.DEV && config.dev?.enableLogger) {
            console.log("✅ API Response:", {
                status: response.status,
                url: response.config.url,
                data: response.data,
            });
        }

        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Log error in development
        if (import.meta.env.DEV) {
            console.error("❌ API Error:", {
                status: error.response?.status,
                url: error.config?.url,
                message: error.message,
                data: error.response?.data,
            });
        }

        // Handle different error status codes
        if (error.response) {
            const { status } = error.response;

            switch (status) {
                case 401:
                    // Unauthorized - Clear token and redirect to login
                    if (!originalRequest._retry) {
                        originalRequest._retry = true;

                        // Clear auth data
                        removeFromStorage(STORAGE_KEYS.TOKEN);
                        removeFromStorage(STORAGE_KEYS.USER);

                        // Redirect to login page
                        if (window.location.pathname !== "/login") {
                            window.location.href = "/login";
                        }
                    }
                    break;

                case 403:
                    // Forbidden - User doesn't have permission
                    const errorMessage = error.response.data?.message || ERROR_MESSAGES.FORBIDDEN;
                    error.message = errorMessage;
                    // Add additional context for read-only roles
                    if (error.response.data?.readOnly) {
                        error.readOnly = true;
                        error.message = `Your role has read-only access. ${errorMessage}`;
                    }
                    break;

                case 404:
                    // Not found
                    error.message = ERROR_MESSAGES.NOT_FOUND;
                    break;

                case 409:
                    // Conflict - usually validation errors
                    error.message =
                        error.response.data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
                    break;

                case 413:
                    // Payload too large
                    error.message = ERROR_MESSAGES.FILE_TOO_LARGE;
                    break;

                case 422:
                    // Unprocessable entity - validation error
                    error.message =
                        error.response.data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
                    break;

                case 429:
                    // Too many requests - rate limit
                    error.message = "Too many requests. Please try again later.";
                    break;

                case 500:
                case 502:
                case 503:
                case 504:
                    // Server errors
                    error.message = ERROR_MESSAGES.SERVER_ERROR;
                    break;

                default:
                    error.message =
                        error.response.data?.message || "An unexpected error occurred";
            }
        } else if (error.request) {
            // Request made but no response
            error.message = ERROR_MESSAGES.NETWORK_ERROR;
        } else {
            // Something else happened
            error.message = error.message || "An unexpected error occurred";
        }

        return Promise.reject(error);
    }
);

/**
 * API helper methods
 */
const apiService = {
    /**
     * GET request
     * @param {string} url - Endpoint URL
     * @param {object} params - Query parameters
     * @param {object} config - Additional axios config
     * @returns {Promise} Response data
     */
    get: (url, params = {}, config = {}) => {
        return api.get(url, { params, ...config }).then(response => response.data);
    },

    /**
     * POST request
     * @param {string} url - Endpoint URL
     * @param {object} data - Request body
     * @param {object} config - Additional axios config
     * @returns {Promise} Response data
     */
    post: (url, data = {}, config = {}) => {
        return api.post(url, data, config).then(response => response.data);
    },

    /**
     * PUT request
     * @param {string} url - Endpoint URL
     * @param {object} data - Request body
     * @param {object} config - Additional axios config
     * @returns {Promise} Response data
     */
    put: (url, data = {}, config = {}) => {
        return api.put(url, data, config).then(response => response.data);
    },

    /**
     * PATCH request
     * @param {string} url - Endpoint URL
     * @param {object} data - Request body
     * @param {object} config - Additional axios config
     * @returns {Promise} Response data
     */
    patch: (url, data = {}, config = {}) => {
        return api.patch(url, data, config).then(response => response.data);
    },

    /**
     * DELETE request
     * @param {string} url - Endpoint URL
     * @param {object} config - Additional axios config
     * @returns {Promise} Response data
     */
    delete: (url, config = {}) => {
        return api.delete(url, config).then(response => response.data);
    },

    /**
     * Upload file with progress
     * @param {string} url - Endpoint URL
     * @param {FormData} formData - Form data with file
     * @param {function} onUploadProgress - Progress callback
     * @returns {Promise} Response data
     */
    upload: (url, formData, onUploadProgress = null) => {
        return api.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
                if (onUploadProgress) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onUploadProgress(percentCompleted);
                }
            },
        }).then(response => response.data);
    },

    /**
     * Download file
     * @param {string} url - Endpoint URL
     * @param {string} filename - Filename to save as
     * @returns {Promise} Blob data
     */
    download: (url, filename = null) => {
        return api.get(url, {
            responseType: "blob",
        }).then(response => {
            // Create download link
            const blob = new Blob([response.data]);
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;

            // Get filename from Content-Disposition header or use provided filename
            const contentDisposition = response.headers["content-disposition"];
            if (contentDisposition && !filename) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            link.download = filename || "download";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            return response.data;
        });
    },

    /**
     * Download file as blob (without auto-download)
     * @param {string} url - Endpoint URL
     * @returns {Promise} Blob data
     */
    downloadBlob: (url) => {
        return api.get(url, {
            responseType: "blob",
        }).then(response => response.data);
    },

    /**
     * Batch requests (parallel)
     * @param {array} requests - Array of request configs
     * @returns {Promise} Array of responses
     */
    batch: (requests) => {
        const promises = requests.map((req) => {
            switch (req.method?.toLowerCase()) {
                case "post":
                    return apiService.post(req.url, req.data, req.config);
                case "put":
                    return apiService.put(req.url, req.data, req.config);
                case "patch":
                    return apiService.patch(req.url, req.data, req.config);
                case "delete":
                    return apiService.delete(req.url, req.config);
                default:
                    return apiService.get(req.url, req.params, req.config);
            }
        });

        return Promise.all(promises);
    },

    /**
     * Health check
     * @returns {Promise} Health status
     */
    healthCheck: () => {
        return api.get("/health").then(response => response.data);
    },

    /**
     * Set auth token
     * @param {string} token - JWT token
     */
    setAuthToken: (token) => {
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common["Authorization"];
        }
    },

    /**
     * Clear auth token
     */
    clearAuthToken: () => {
        delete api.defaults.headers.common["Authorization"];
    },

    /**
     * Get axios instance (for custom requests)
     */
    getInstance: () => api,
};

// Export both the instance and service
export { api };
export default apiService;