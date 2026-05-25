/**
 * BintangToba - Logger Utility
 * Handles application logging with debug support.
 */

import { CONFIG } from './constants.js';

let _debugEnabled = CONFIG.DEBUG;

export const Logger = {
    info(...args) {
        console.log('[BintangTobaPro]', ...args);
    },
    debug(...args) {
        if (_debugEnabled) {
            console.log('[BintangTobaPro:DBG]', ...args);
        }
    },
    warn(...args) {
        console.warn('[BintangTobaPro]', ...args);
    },
    error(...args) {
        console.error('[BintangTobaPro]', ...args);
    },
    /**
     * Set debug flag status
     * @param {boolean} enabled 
     */
    setDebug(enabled) {
        _debugEnabled = !!enabled;
    }
};
