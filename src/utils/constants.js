// src/utils/constants.js

// User Roles
export const USER_ROLES = {
    ADMIN: 'admin',
    SUPPORT: 'support',
    MODERATOR: 'moderator',
    USER: 'user',
};

// Role Labels
export const ROLE_LABELS = {
    admin: 'Administrator',
    support: 'Support',
    moderator: 'Moderator',
    user: 'User',
};

// Document File Types
export const FILE_TYPES = {
    PDF: 'application/pdf',
    DOC: 'application/msword',
    DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    XLS: 'application/vnd.ms-excel',
    XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    TXT: 'text/plain',
    CSV: 'text/csv',
    JPG: 'image/jpeg',
    JPEG: 'image/jpeg',
    PNG: 'image/png',
    GIF: 'image/gif',
};

// File Type Icons
export const FILE_TYPE_ICONS = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    xls: '📊',
    xlsx: '📊',
    txt: '📃',
    csv: '📊',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
};

// File Type Colors (Tailwind classes)
export const FILE_TYPE_COLORS = {
    pdf: 'bg-red-100 text-red-800',
    doc: 'bg-blue-100 text-blue-800',
    docx: 'bg-blue-100 text-blue-800',
    xls: 'bg-green-100 text-green-800',
    xlsx: 'bg-green-100 text-green-800',
    txt: 'bg-gray-100 text-gray-800',
    csv: 'bg-green-100 text-green-800',
    jpg: 'bg-purple-100 text-purple-800',
    jpeg: 'bg-purple-100 text-purple-800',
    png: 'bg-purple-100 text-purple-800',
    gif: 'bg-purple-100 text-purple-800',
};

// Task Status
export const TASK_STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
};

// Task Status Labels
export const TASK_STATUS_LABELS = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled',
};

// Task Status Colors
export const TASK_STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
};

// Task Types
export const TASK_TYPES = {
    UNSUBSCRIBE: 'unsubscribe',
    FOLLOW_UP: 'follow_up',
    REVIEW: 'review',
    OTHER: 'other',
};

// Task Type Labels
export const TASK_TYPE_LABELS = {
    unsubscribe: 'Unsubscribe',
    follow_up: 'Follow Up',
    review: 'Review',
    other: 'Other',
};

// Task Type Icons
export const TASK_TYPE_ICONS = {
    unsubscribe: '🚫',
    follow_up: '📞',
    review: '📋',
    other: '📌',
};

// Task Channels
export const TASK_CHANNELS = {
    EMAIL: 'email',
    URL: 'url',
    PHONE: 'phone',
};

// Task Channel Labels
export const TASK_CHANNEL_LABELS = {
    email: 'Email',
    url: 'URL',
    phone: 'Phone',
};

// Task Channel Icons
export const TASK_CHANNEL_ICONS = {
    email: '✉️',
    url: '🔗',
    phone: '📱',
};

// Action Types
export const ACTION_TYPES = {
    MAKE_CSV: 'make_csv',
    MAKE_DOCUMENT: 'make_document',
};

// Action Type Labels
export const ACTION_TYPE_LABELS = {
    make_csv: 'Generate CSV',
    make_document: 'Generate Document',
};

// Action Status
export const ACTION_STATUS = {
    PENDING: 'pending',
    RUNNING: 'running',
    COMPLETED: 'completed',
    FAILED: 'failed',
};

// Action Status Labels
export const ACTION_STATUS_LABELS = {
    pending: 'Pending',
    running: 'Running',
    completed: 'Completed',
    failed: 'Failed',
};

// Action Status Colors
export const ACTION_STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800',
    running: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
};

// Action Scope Types
export const SCOPE_TYPES = {
    FOLDER: 'folder',
    FILES: 'files',
};

// Webhook Classifications
export const WEBHOOK_CLASSIFICATIONS = {
    OFFICIAL: 'official',
    AD: 'ad',
    UNKNOWN: 'unknown',
};

// Webhook Classification Labels
export const WEBHOOK_CLASSIFICATION_LABELS = {
    official: 'Official',
    ad: 'Advertisement',
    unknown: 'Unknown',
};

// Webhook Classification Colors
export const WEBHOOK_CLASSIFICATION_COLORS = {
    official: 'bg-green-100 text-green-800',
    ad: 'bg-orange-100 text-orange-800',
    unknown: 'bg-gray-100 text-gray-800',
};

// Webhook Status
export const WEBHOOK_STATUS = {
    RECEIVED: 'received',
    PROCESSING: 'processing',
    PROCESSED: 'processed',
    FAILED: 'failed',
};

// Audit Actions
export const AUDIT_ACTIONS = {
    USER_LOGIN: 'user.login',
    USER_LOGOUT: 'user.logout',
    DOCUMENT_UPLOAD: 'document.upload',
    DOCUMENT_VIEW: 'document.view',
    DOCUMENT_DOWNLOAD: 'document.download',
    DOCUMENT_DELETE: 'document.delete',
    TAG_CREATE: 'tag.create',
    TAG_DELETE: 'tag.delete',
    TAG_ASSIGN: 'tag.assign',
    ACTION_RUN: 'action.run',
    ACTION_COMPLETE: 'action.complete',
    ACTION_FAIL: 'action.fail',
    WEBHOOK_RECEIVED: 'webhook.received',
    WEBHOOK_PROCESSED: 'webhook.processed',
    TASK_CREATE: 'task.create',
    TASK_UPDATE: 'task.update',
    TASK_COMPLETE: 'task.complete',
};

// Pagination
export const PAGINATION_DEFAULTS = {
    PAGE: 1,
    LIMIT: 20,
};

// View Modes
export const VIEW_MODES = {
    GRID: 'grid',
    LIST: 'list',
};

// Sort Orders
export const SORT_ORDERS = {
    ASC: 'asc',
    DESC: 'desc',
};

// Local Storage Keys
export const STORAGE_KEYS = {
    TOKEN: 'dms_token',
    USER: 'dms_user',
    THEME: 'dms_theme',
    SIDEBAR: 'dms_sidebar',
    VIEW_MODE: 'dms_view_mode',
};

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',
    ME: '/users/me',

    // Documents
    DOCUMENTS: '/docs',
    DOCUMENT_UPLOAD: '/docs',
    DOCUMENT_DOWNLOAD: '/docs/:id/download',
    DOCUMENT_SEARCH: '/docs/search',

    // Tags
    TAGS: '/tags',
    FOLDERS: '/folders',
    FOLDER_DOCS: '/folders/:name/docs',

    // Actions
    ACTIONS: '/actions',
    ACTION_RUN: '/actions/run',
    ACTION_USAGE_MONTH: '/actions/usage/month',
    ACTION_USAGE_ALL: '/actions/usage/all',

    // Tasks
    TASKS: '/tasks',
    TASK_STATS: '/tasks/stats',
    TASK_TODAY: '/tasks/today',
    TASK_OVERDUE: '/tasks/overdue',
    TASK_COMPLETE: '/tasks/:id/complete',
    TASK_FAIL: '/tasks/:id/fail',
    TASK_CANCEL: '/tasks/:id/cancel',

    // Webhooks
    WEBHOOKS: '/webhooks',
    WEBHOOK_STATS: '/webhooks/stats/summary',

    // Audit
    AUDIT: '/audit',
    AUDIT_ME: '/audit/me',

    // Metrics
    METRICS: '/metrics',
    METRICS_ME: '/metrics/me',
    METRICS_DOCUMENTS: '/metrics/documents',
    METRICS_ACTIONS: '/metrics/actions',
    METRICS_TASKS: '/metrics/tasks',
    METRICS_WEBHOOKS: '/metrics/webhooks',
    METRICS_DETAILED: '/metrics/detailed',

    // Health
    HEALTH: '/health',
};

// Toast Types
export const TOAST_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning',
};

// Date Formats
export const DATE_FORMATS = {
    FULL: 'MMMM DD, YYYY HH:mm:ss',
    DATE_TIME: 'MMM DD, YYYY HH:mm',
    DATE: 'MMM DD, YYYY',
    TIME: 'HH:mm',
    SHORT: 'MM/DD/YYYY',
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized. Please login again.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    UPLOAD_ERROR: 'Failed to upload file. Please try again.',
    FILE_TOO_LARGE: 'File size exceeds the maximum allowed size.',
    INVALID_FILE_TYPE: 'Invalid file type. Please upload a supported file.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN: 'Login successful!',
    LOGOUT: 'Logout successful!',
    DOCUMENT_UPLOAD: 'Document uploaded successfully!',
    DOCUMENT_DELETE: 'Document deleted successfully!',
    TAG_CREATE: 'Tag created successfully!',
    TAG_DELETE: 'Tag deleted successfully!',
    ACTION_RUN: 'Action started successfully!',
    TASK_CREATE: 'Task created successfully!',
    TASK_UPDATE: 'Task updated successfully!',
    TASK_COMPLETE: 'Task completed successfully!',
    TASK_DELETE: 'Task deleted successfully!',
    WEBHOOK_CREATE: 'Webhook created successfully!',
    WEBHOOK_UPDATE: 'Webhook updated successfully!',
    WEBHOOK_DELETE: 'Webhook deleted successfully!',
    WEBHOOK_TEST: 'Webhook test sent successfully!',
};






// Kanban Task Statuses (for Kanban board - user-facing task management)
export const TASK_STATUSES = {
    todo: {
        label: 'To Do',
        color: 'blue',
    },
    in_progress: {
        label: 'In Progress',
        color: 'yellow',
    },
    done: {
        label: 'Done',
        color: 'green',
    },
};

// Task Priorities (for Kanban board tasks)
export const TASK_PRIORITIES = {
    low: {
        label: 'Low Priority',
        color: 'green',
        icon: '🟢',
    },
    medium: {
        label: 'Medium Priority',
        color: 'yellow',
        icon: '🟡',
    },
    high: {
        label: 'High Priority',
        color: 'red',
        icon: '🔴',
    },
};

// Task Priority Colors (for badges)
export const TASK_PRIORITY_COLORS = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200',
};

// Task Types


// ... rest of your constants


// Add after AUDIT_ACTIONS or at the end of the file

// Webhook Event Types
export const WEBHOOK_EVENT_TYPES = {
    DOCUMENT_UPLOADED: 'document.uploaded',
    DOCUMENT_DELETED: 'document.deleted',
    ACTION_COMPLETED: 'action.completed',
    ACTION_FAILED: 'action.failed',
    TASK_CREATED: 'task.created',
    TASK_COMPLETED: 'task.completed',
    TASK_FAILED: 'task.failed',
};

// Webhook Event Type Labels
export const WEBHOOK_EVENT_TYPE_LABELS = {
    'document.uploaded': 'Document Uploaded',
    'document.deleted': 'Document Deleted',
    'action.completed': 'Action Completed',
    'action.failed': 'Action Failed',
    'task.created': 'Task Created',
    'task.completed': 'Task Completed',
    'task.failed': 'Task Failed',
};

// Webhook Event Type Descriptions
export const WEBHOOK_EVENT_TYPE_DESCRIPTIONS = {
    'document.uploaded': 'Triggered when a new document is uploaded',
    'document.deleted': 'Triggered when a document is deleted',
    'action.completed': 'Triggered when an AI action completes successfully',
    'action.failed': 'Triggered when an AI action fails',
    'task.created': 'Triggered when a new task is created',
    'task.completed': 'Triggered when a task is completed',
    'task.failed': 'Triggered when a task fails',
};


// Add after AUDIT_ACTIONS

// Audit Action Labels
export const AUDIT_ACTION_LABELS = {
    'user.login': '🔐 User Login',
    'user.logout': '🚪 User Logout',
    'document.upload': '📤 Document Upload',
    'document.view': '👁️ Document View',
    'document.download': '📥 Document Download',
    'document.delete': '🗑️ Document Delete',
    'tag.create': '🏷️ Tag Create',
    'tag.delete': '❌ Tag Delete',
    'tag.assign': '📌 Tag Assign',
    'action.run': '🤖 Action Run',
    'action.complete': '✅ Action Complete',
    'action.fail': '❌ Action Fail',
    'webhook.received': '📨 Webhook Received',
    'webhook.processed': '✔️ Webhook Processed',
    'task.create': '📝 Task Create',
    'task.update': '✏️ Task Update',
    'task.complete': '✅ Task Complete',
};

// Audit Action Colors
export const AUDIT_ACTION_COLORS = {
    'user.login': 'bg-green-100 text-green-800',
    'user.logout': 'bg-gray-100 text-gray-800',
    'document.upload': 'bg-blue-100 text-blue-800',
    'document.view': 'bg-purple-100 text-purple-800',
    'document.download': 'bg-indigo-100 text-indigo-800',
    'document.delete': 'bg-red-100 text-red-800',
    'tag.create': 'bg-green-100 text-green-800',
    'tag.delete': 'bg-red-100 text-red-800',
    'tag.assign': 'bg-blue-100 text-blue-800',
    'action.run': 'bg-purple-100 text-purple-800',
    'action.complete': 'bg-green-100 text-green-800',
    'action.fail': 'bg-red-100 text-red-800',
    'webhook.received': 'bg-yellow-100 text-yellow-800',
    'webhook.processed': 'bg-green-100 text-green-800',
    'task.create': 'bg-blue-100 text-blue-800',
    'task.update': 'bg-yellow-100 text-yellow-800',
    'task.complete': 'bg-green-100 text-green-800',
};