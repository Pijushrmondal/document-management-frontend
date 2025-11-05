// src/utils/permissions.js

import { USER_ROLES } from './constants';

/**
 * Permissions Utility Class
 * Provides role-based permission checks for RBAC
 */
export class Permissions {
    /**
     * Check if user can perform write operations
     * @param {string} role - User role
     * @returns {boolean} True if user can write
     */
    static canWrite(role) {
        return role === USER_ROLES.ADMIN || role === USER_ROLES.USER;
    }

    /**
     * Check if user has read-only access
     * @param {string} role - User role
     * @returns {boolean} True if user has read-only access
     */
    static isReadOnly(role) {
        return role === USER_ROLES.SUPPORT || role === USER_ROLES.MODERATOR;
    }

    /**
     * Check if user has full admin access
     * @param {string} role - User role
     * @returns {boolean} True if user is admin
     */
    static hasFullAccess(role) {
        return role === USER_ROLES.ADMIN;
    }

    /**
     * Check if user can run actions
     * @param {string} role - User role
     * @returns {boolean} True if user can run actions
     */
    static canRunActions(role) {
        return role === USER_ROLES.ADMIN || role === USER_ROLES.USER;
    }

    /**
     * Check if user can view metrics
     * @param {string} role - User role
     * @returns {boolean} True if user can view metrics
     */
    static canViewMetrics(role) {
        // All roles can view metrics
        return true;
    }

    /**
     * Check if user can view audit logs
     * @param {string} role - User role
     * @returns {boolean} True if user can view audit logs
     */
    static canViewAudit(role) {
        // All roles can view audit logs
        return true;
    }

    /**
     * Check if user can view webhooks
     * @param {string} role - User role
     * @returns {boolean} True if user can view webhooks
     */
    static canViewWebhooks(role) {
        // All roles can view webhooks
        return true;
    }

    /**
     * Check if user can manage other users (admin only)
     * @param {string} role - User role
     * @returns {boolean} True if user is admin
     */
    static canManageUsers(role) {
        return role === USER_ROLES.ADMIN;
    }
}

