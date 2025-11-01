// src/utils/formatters.js

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DATE_FORMATS } from './constants';

// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

/**
 * Format date to specified format
 * @param {string|Date} date - Date to format
 * @param {string} format - Format string (default: DATE_TIME)
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = DATE_FORMATS.DATE_TIME) => {
    if (!date) return '';
    return dayjs(date).format(format);
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
    if (!date) return '';
    return dayjs(date).fromNow();
};

/**
 * Format date to full format
 * @param {string|Date} date - Date to format
 * @returns {string} Full date format
 */
export const formatFullDate = (date) => {
    return formatDate(date, DATE_FORMATS.FULL);
};

/**
 * Format date to short format
 * @param {string|Date} date - Date to format
 * @returns {string} Short date format
 */
export const formatShortDate = (date) => {
    return formatDate(date, DATE_FORMATS.SHORT);
};

/**
 * Format date to date only
 * @param {string|Date} date - Date to format
 * @returns {string} Date only
 */
export const formatDateOnly = (date) => {
    return formatDate(date, DATE_FORMATS.DATE);
};

/**
 * Format date to time only
 * @param {string|Date} date - Date to format
 * @returns {string} Time only
 */
export const formatTimeOnly = (date) => {
    return formatDate(date, DATE_FORMATS.TIME);
};

/**
 * Check if date is today
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if today
 */
export const isToday = (date) => {
    if (!date) return false;
    return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * Check if date is overdue
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if overdue
 */
export const isOverdue = (date) => {
    if (!date) return false;
    return dayjs(date).isBefore(dayjs(), 'day');
};

/**
 * Get days until date
 * @param {string|Date} date - Target date
 * @returns {number} Days until date (negative if past)
 */
export const daysUntil = (date) => {
    if (!date) return 0;
    return dayjs(date).diff(dayjs(), 'day');
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
    if (amount === null || amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

/**
 * Format percentage
 * @param {number} value - Value to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 2) => {
    if (value === null || value === undefined) return '0%';
    return `${value.toFixed(decimals)}%`;
};

/**
 * Format number with K, M, B suffixes
 * @param {number} num - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted number
 */
export const formatCompactNumber = (num, decimals = 1) => {
    if (num === null || num === undefined) return '0';

    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';

    if (absNum >= 1e9) {
        return sign + (absNum / 1e9).toFixed(decimals) + 'B';
    }
    if (absNum >= 1e6) {
        return sign + (absNum / 1e6).toFixed(decimals) + 'M';
    }
    if (absNum >= 1e3) {
        return sign + (absNum / 1e3).toFixed(decimals) + 'K';
    }
    return sign + absNum.toString();
};

/**
 * Format phone number
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
};

/**
 * Format email (truncate if too long)
 * @param {string} email - Email to format
 * @param {number} maxLength - Maximum length
 * @returns {string} Formatted email
 */
export const formatEmail = (email, maxLength = 30) => {
    if (!email) return '';
    if (email.length <= maxLength) return email;

    const [local, domain] = email.split('@');
    if (!domain) return email.substring(0, maxLength) + '...';

    const truncatedLocal = local.substring(0, maxLength - domain.length - 4) + '...';
    return truncatedLocal + '@' + domain;
};

/**
 * Format URL (remove protocol and www)
 * @param {string} url - URL to format
 * @returns {string} Formatted URL
 */
export const formatUrl = (url) => {
    if (!url) return '';
    return url.replace(/^(https?:\/\/)?(www\.)?/, '');
};

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted size
 */
export const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    if (!bytes) return '';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format duration in seconds to human readable
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (seconds) => {
    if (!seconds || seconds < 0) return '0s';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(' ');
};

/**
 * Format array to comma-separated string
 * @param {array} array - Array to format
 * @param {string} conjunction - Conjunction word (default: 'and')
 * @returns {string} Formatted string
 */
export const formatList = (array, conjunction = 'and') => {
    if (!array || array.length === 0) return '';
    if (array.length === 1) return array[0];
    if (array.length === 2) return array.join(` ${conjunction} `);

    const last = array[array.length - 1];
    const rest = array.slice(0, -1);
    return rest.join(', ') + `, ${conjunction} ${last}`;
};

/**
 * Format username from email
 * @param {string} email - Email address
 * @returns {string} Username
 */
export const formatUsername = (email) => {
    if (!email) return '';
    return email.split('@')[0];
};

/**
 * Format initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 letters)
 */
export const formatInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Format search query highlight
 * @param {string} text - Text to highlight
 * @param {string} query - Search query
 * @returns {string} Text with HTML highlights
 */
export const highlightText = (text, query) => {
    if (!text || !query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
};

/**
 * Format tag name (lowercase, replace spaces with hyphens)
 * @param {string} name - Tag name
 * @returns {string} Formatted tag name
 */
export const formatTagName = (name) => {
    if (!name) return '';
    return name.toLowerCase().trim().replace(/\s+/g, '-');
};

/**
 * Format display name from tag name
 * @param {string} name - Tag name (hyphenated)
 * @returns {string} Display name
 */
export const formatDisplayName = (name) => {
    if (!name) return '';
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Pluralize word based on count
 * @param {number} count - Count
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form (optional)
 * @returns {string} Pluralized string
 */
export const pluralize = (count, singular, plural = null) => {
    if (count === 1) return `${count} ${singular}`;
    return `${count} ${plural || singular + 's'}`;
};