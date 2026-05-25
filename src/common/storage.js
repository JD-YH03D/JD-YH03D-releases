/**
 * BintangToba - Storage Utilities
 * Abstracted storage access with localStorage fallback.
 */

import { Logger } from '../core/logger.js';

/**
 * Safely get value from GM storage or localStorage fallback
 * @param {string} key
 * @param {*} defaultValue
 * @returns {*}
 */
export function safeGM_getValue(key, defaultValue) {
    try {
        if (typeof GM_getValue !== 'undefined') {
            const val = GM_getValue(key);
            return val !== undefined ? val : defaultValue;
        }
        const stored = localStorage.getItem(key);
        return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch (e) {
        Logger.debug('Storage read error:', e.message);
        return defaultValue;
    }
}

/**
 * Safely set value in GM storage or localStorage fallback
 * @param {string} key
 * @param {*} value
 */
export function safeGM_setValue(key, value) {
    try {
        if (typeof GM_setValue !== 'undefined') {
            GM_setValue(key, value);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    } catch (e) {
        Logger.error('Storage write error:', e);
    }
}
