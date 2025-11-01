// src/utils/fileHelpers.js

import { FILE_TYPE_ICONS, FILE_TYPE_COLORS } from './constants';
import { getFileExtension } from './helpers';

/**
 * Get file icon based on extension
 * @param {string} filename - Name of the file
 * @returns {string} Icon emoji
 */
export const getFileIcon = (filename) => {
    const ext = getFileExtension(filename);
    return FILE_TYPE_ICONS[ext] || '📄';
};

/**
 * Get file type color class based on extension
 * @param {string} filename - Name of the file
 * @returns {string} Tailwind color classes
 */
export const getFileTypeColor = (filename) => {
    const ext = getFileExtension(filename);
    return FILE_TYPE_COLORS[ext] || 'bg-gray-100 text-gray-800';
};

/**
 * Check if file is image
 * @param {string} filename - Name of the file
 * @returns {boolean} True if image
 */
export const isImageFile = (filename) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
    const ext = getFileExtension(filename);
    return imageExtensions.includes(ext);
};

/**
 * Check if file is document
 * @param {string} filename - Name of the file
 * @returns {boolean} True if document
 */
export const isDocumentFile = (filename) => {
    const docExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
    const ext = getFileExtension(filename);
    return docExtensions.includes(ext);
};

/**
 * Check if file is spreadsheet
 * @param {string} filename - Name of the file
 * @returns {boolean} True if spreadsheet
 */
export const isSpreadsheetFile = (filename) => {
    const sheetExtensions = ['xls', 'xlsx', 'csv', 'ods'];
    const ext = getFileExtension(filename);
    return sheetExtensions.includes(ext);
};

/**
 * Get file category
 * @param {string} filename - Name of the file
 * @returns {string} Category (image, document, spreadsheet, other)
 */
export const getFileCategory = (filename) => {
    if (isImageFile(filename)) return 'image';
    if (isDocumentFile(filename)) return 'document';
    if (isSpreadsheetFile(filename)) return 'spreadsheet';
    return 'other';
};

/**
 * Read file as Data URL
 * @param {File} file - File to read
 * @returns {Promise<string>} Data URL
 */
export const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
};

/**
 * Read file as text
 * @param {File} file - File to read
 * @returns {Promise<string>} File content as text
 */
export const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
};

/**
 * Create file preview URL
 * @param {File} file - File to create preview for
 * @returns {Promise<string|null>} Preview URL or null
 */
export const createFilePreview = async (file) => {
    if (!file) return null;

    if (isImageFile(file.name)) {
        return await readFileAsDataURL(file);
    }

    return null;
};

/**
 * Revoke object URL
 * @param {string} url - Object URL to revoke
 */
export const revokeObjectURL = (url) => {
    if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
    }
};

/**
 * Download file from blob
 * @param {Blob} blob - Blob data
 * @param {string} filename - Filename to save as
 */
export const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Convert base64 to blob
 * @param {string} base64 - Base64 string
 * @param {string} contentType - MIME type
 * @returns {Blob} Blob object
 */
export const base64ToBlob = (base64, contentType = '') => {
    const byteCharacters = atob(base64.split(',')[1] || base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
};

/**
 * Get MIME type from file extension
 * @param {string} filename - Filename
 * @returns {string} MIME type
 */
export const getMimeType = (filename) => {
    const ext = getFileExtension(filename);
    const mimeTypes = {
        pdf: 'application/pdf',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        xls: 'application/vnd.ms-excel',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        txt: 'text/plain',
        csv: 'text/csv',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
    };
    return mimeTypes[ext] || 'application/octet-stream';
};

/**
 * Format file list for display
 * @param {FileList|array} files - Files to format
 * @returns {array} Formatted file objects
 */
export const formatFileList = (files) => {
    return Array.from(files).map((file, index) => ({
        id: `file-${index}-${Date.now()}`,
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        extension: getFileExtension(file.name),
        icon: getFileIcon(file.name),
        color: getFileTypeColor(file.name),
        category: getFileCategory(file.name),
        preview: null,
        progress: 0,
        status: 'pending', // pending, uploading, completed, error
        error: null,
    }));
};

/**
 * Check if file type is supported for preview
 * @param {string} filename - Filename
 * @returns {boolean} True if preview supported
 */
export const supportsPreview = (filename) => {
    return isImageFile(filename);
};