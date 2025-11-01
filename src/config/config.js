// src/config/config.js

const config = {
    // API Configuration
    api: {
        baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/v1',
        timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
    },

    // Application Configuration
    app: {
        name: import.meta.env.VITE_APP_NAME || 'Document Management System',
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    },

    // File Upload Configuration
    upload: {
        maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760, // 10MB
        allowedFileTypes: import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(',') || [
            'pdf',
            'doc',
            'docx',
            'xls',
            'xlsx',
            'txt',
            'csv',
            'jpg',
            'jpeg',
            'png',
            'gif',
        ],
    },

    // Pagination Configuration
    pagination: {
        defaultPageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 20,
        maxPageSize: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE) || 100,
    },

    // Action Configuration
    action: {
        creditCost: parseInt(import.meta.env.VITE_ACTION_CREDIT_COST) || 5,
    },

    // Task Configuration
    task: {
        rateLimit: parseInt(import.meta.env.VITE_TASK_RATE_LIMIT) || 3,
    },

    // Development Configuration
    dev: {
        enableDevtools: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
        enableLogger: import.meta.env.VITE_ENABLE_LOGGER === 'true',
    },

    // Feature Flags
    features: {
        darkMode: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
        notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',
    },
};

export default config;