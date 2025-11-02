// src/utils/validators.js

import config from '../config/config';

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone to validate
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
    if (!phone) return false;
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
export const isValidUrl = (url) => {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {array} allowedTypes - Allowed file extensions
 * @returns {boolean} True if valid
 */
export const isValidFileType = (file, allowedTypes = null) => {
    if (!file) return false;

    const types = allowedTypes || config.upload.allowedFileTypes;
    const extension = file.name.split('.').pop().toLowerCase();

    return types.includes(extension);
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum size in bytes
 * @returns {boolean} True if valid
 */
export const isValidFileSize = (file, maxSize = null) => {
    if (!file) return false;

    const max = maxSize || config.upload.maxFileSize;
    return file.size <= max;
};

/**
 * Validate file (type and size)
 * @param {File} file - File to validate
 * @returns {object} { valid: boolean, error: string }
 */
export const validateFile = (file) => {
    if (!file) {
        return { valid: false, error: 'No file selected' };
    }

    if (!isValidFileType(file)) {
        return {
            valid: false,
            error: `Invalid file type. Allowed: ${config.upload.allowedFileTypes.join(', ')}`,
        };
    }

    if (!isValidFileSize(file)) {
        return {
            valid: false,
            error: `File too large. Maximum size: ${config.upload.maxFileSize / 1024 / 1024}MB`,
        };
    }

    return { valid: true, error: null };
};

/**
 * Validate multiple files
 * @param {FileList|array} files - Files to validate
 * @returns {object} { valid: boolean, errors: array }
 */
export const validateFiles = (files) => {
    if (!files || files.length === 0) {
        return { valid: false, errors: ['No files selected'] };
    }

    const errors = [];
    Array.from(files).forEach((file, index) => {
        const result = validateFile(file);
        if (!result.valid) {
            errors.push(`File ${index + 1} (${file.name}): ${result.error}`);
        }
    });

    return {
        valid: errors.length === 0,
        errors,
    };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {object} { valid: boolean, error: string }
 */
export const validateRequired = (value, fieldName = 'Field') => {
    const isEmpty =
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0);

    return {
        valid: !isEmpty,
        error: isEmpty ? `${fieldName} is required` : null,
    };
};

/**
 * Validate string length
 * @param {string} value - Value to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @param {string} fieldName - Field name for error message
 * @returns {object} { valid: boolean, error: string }
 */
export const validateLength = (value, min = 0, max = Infinity, fieldName = 'Field') => {
    if (!value) {
        return { valid: false, error: `${fieldName} is required` };
    }

    const length = value.length;

    if (length < min) {
        return {
            valid: false,
            error: `${fieldName} must be at least ${min} characters`,
        };
    }

    if (length > max) {
        return {
            valid: false,
            error: `${fieldName} must be at most ${max} characters`,
        };
    }

    return { valid: true, error: null };
};

/**
 * Validate number range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Field name for error message
 * @returns {object} { valid: boolean, error: string }
 */
export const validateRange = (value, min = -Infinity, max = Infinity, fieldName = 'Field') => {
    if (value === null || value === undefined || isNaN(value)) {
        return { valid: false, error: `${fieldName} must be a number` };
    }

    if (value < min) {
        return {
            valid: false,
            error: `${fieldName} must be at least ${min}`,
        };
    }

    if (value > max) {
        return {
            valid: false,
            error: `${fieldName} must be at most ${max}`,
        };
    }

    return { valid: true, error: null };
};

/**
 * Validate tag name format
 * @param {string} name - Tag name to validate
 * @returns {object} { valid: boolean, error: string }
 */
export const validateTagName = (name) => {
    if (!name || name.trim() === '') {
        return { valid: false, error: 'Tag name is required' };
    }

    if (name.length < 2) {
        return { valid: false, error: 'Tag name must be at least 2 characters' };
    }

    if (name.length > 50) {
        return { valid: false, error: 'Tag name must be at most 50 characters' };
    }

    // Only allow alphanumeric, hyphens, underscores
    const regex = /^[a-zA-Z0-9_-]+$/;
    if (!regex.test(name)) {
        return {
            valid: false,
            error: 'Tag name can only contain letters, numbers, hyphens, and underscores',
        };
    }

    return { valid: true, error: null };
};

/**
 * Validate action scope
 * @param {object} scope - Scope object { type, name, ids }
 * @returns {object} { valid: boolean, error: string }
 */
export const validateActionScope = (scope) => {
    if (!scope || !scope.type) {
        return { valid: false, error: 'Scope type is required' };
    }

    if (scope.type === 'folder') {
        if (!scope.name) {
            return { valid: false, error: 'Folder name is required' };
        }
    } else if (scope.type === 'files') {
        if (!scope.ids || scope.ids.length === 0) {
            return { valid: false, error: 'At least one file must be selected' };
        }
    } else {
        return { valid: false, error: 'Invalid scope type' };
    }

    // XOR validation: Cannot have both folder and files
    if (scope.name && scope.ids && scope.ids.length > 0) {
        return {
            valid: false,
            error: 'Cannot select both folder and files. Choose one.',
        };
    }

    return { valid: true, error: null };
};

/**
 * Validate date format
 * @param {string} date - Date string to validate
 * @returns {boolean} True if valid
 */
export const isValidDate = (date) => {
    if (!date) return false;
    const timestamp = Date.parse(date);
    return !isNaN(timestamp);
};

/**
 * Validate future date
 * @param {string} date - Date string to validate
 * @returns {object} { valid: boolean, error: string }
 */
export const validateFutureDate = (date) => {
    if (!date) {
        return { valid: false, error: 'Date is required' };
    }

    if (!isValidDate(date)) {
        return { valid: false, error: 'Invalid date format' };
    }

    const dateObj = new Date(date);
    const now = new Date();

    if (dateObj < now) {
        return { valid: false, error: 'Date must be in the future' };
    }

    return { valid: true, error: null };
};

/**
 * Validate form data
 * @param {object} data - Form data
 * @param {object} rules - Validation rules
 * @returns {object} { valid: boolean, errors: object }
 */
export const validateForm = (data, rules) => {
    const errors = {};

    Object.keys(rules).forEach((field) => {
        const rule = rules[field];
        const value = data[field];

        if (rule.required) {
            const result = validateRequired(value, rule.label || field);
            if (!result.valid) {
                errors[field] = result.error;
                return;
            }
        }

        if (rule.email && value) {
            if (!isValidEmail(value)) {
                errors[field] = `${rule.label || field} must be a valid email`;
                return;
            }
        }

        if (rule.phone && value) {
            if (!isValidPhone(value)) {
                errors[field] = `${rule.label || field} must be a valid phone number`;
                return;
            }
        }

        if (rule.url && value) {
            if (!isValidUrl(value)) {
                errors[field] = `${rule.label || field} must be a valid URL`;
                return;
            }
        }

        if (rule.minLength && value) {
            const result = validateLength(value, rule.minLength, Infinity, rule.label || field);
            if (!result.valid) {
                errors[field] = result.error;
                return;
            }
        }

        if (rule.maxLength && value) {
            const result = validateLength(value, 0, rule.maxLength, rule.label || field);
            if (!result.valid) {
                errors[field] = result.error;
                return;
            }
        }

        if (rule.min !== undefined && value !== null && value !== undefined) {
            const result = validateRange(value, rule.min, Infinity, rule.label || field);
            if (!result.valid) {
                errors[field] = result.error;
                return;
            }
        }

        if (rule.max !== undefined && value !== null && value !== undefined) {
            const result = validateRange(value, -Infinity, rule.max, rule.label || field);
            if (!result.valid) {
                errors[field] = result.error;
                return;
            }
        }

        if (rule.custom && typeof rule.custom === 'function') {
            const result = rule.custom(value, data);
            if (!result.valid) {
                errors[field] = result.error;
            }
        }
    });

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};


/**
 * Validate task data
 * @param {object} taskData - Task data to validate
 * @returns {object} { valid: boolean, errors: object }
 */
export const validateTaskData = (taskData) => {
    const errors = {};

    // Validate title
    if (!taskData.title || taskData.title.trim() === '') {
        errors.title = 'Title is required';
    } else if (taskData.title.length < 3) {
        errors.title = 'Title must be at least 3 characters';
    } else if (taskData.title.length > 200) {
        errors.title = 'Title must be at most 200 characters';
    }

    // Validate description (optional, but has max length)
    if (taskData.description && taskData.description.length > 1000) {
        errors.description = 'Description must be at most 1000 characters';
    }

    // Validate status
    const validStatuses = ['todo', 'in_progress', 'done'];
    if (!taskData.status) {
        errors.status = 'Status is required';
    } else if (!validStatuses.includes(taskData.status)) {
        errors.status = 'Invalid status';
    }

    // Validate priority
    const validPriorities = ['low', 'medium', 'high'];
    if (!taskData.priority) {
        errors.priority = 'Priority is required';
    } else if (!validPriorities.includes(taskData.priority)) {
        errors.priority = 'Invalid priority';
    }

    // Validate due date (optional, but must be valid date if provided)
    if (taskData.dueDate) {
        if (!isValidDate(taskData.dueDate)) {
            errors.dueDate = 'Invalid date format';
        }
    }

    // Validate assignee (optional, but has max length)
    if (taskData.assignee && taskData.assignee.length > 100) {
        errors.assignee = 'Assignee name must be at most 100 characters';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};


/**
 * Validate webhook data
 * @param {object} webhookData - Webhook data to validate
 * @returns {object} { valid: boolean, errors: object }
 */
export const validateWebhookData = (webhookData) => {
    const errors = {};

    // Validate URL
    if (!webhookData.url || webhookData.url.trim() === '') {
        errors.url = 'Webhook URL is required';
    } else if (!isValidUrl(webhookData.url)) {
        errors.url = 'Please enter a valid URL';
    } else if (!webhookData.url.startsWith('https://')) {
        errors.url = 'Webhook URL must use HTTPS';
    }

    // Validate events
    if (!webhookData.events || webhookData.events.length === 0) {
        errors.events = 'Please select at least one event type';
    }

    // Validate description (optional, but has max length)
    if (webhookData.description && webhookData.description.length > 500) {
        errors.description = 'Description must be at most 500 characters';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};