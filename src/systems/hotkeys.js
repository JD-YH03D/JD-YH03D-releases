/**
 * BintangToba - Hotkey Management
 * Handles normalization, caching, and description of keyboard shortcuts.
 */

import { CONFIG } from '../core/constants.js';
import { safeGM_getValue, safeGM_setValue } from '../common/storage.js';

let hotkeyCache = null;
let hotkeyCacheTime = 0;

/**
 * Normalize hotkey string for comparison
 * @param {string} key
 * @returns {string}
 */
export function normalizeHotkey(key) {
    return String(key || '').toLowerCase().trim();
}

/**
 * Get current hotkeys configuration with caching
 * @returns {Object}
 */
export function getHotkeys() {
    const now = Date.now();
    if (!hotkeyCache || (now - hotkeyCacheTime) > CONFIG.TIMING.HOTKEY_CACHE_TTL) {
        hotkeyCache = safeGM_getValue(CONFIG.STORAGE_KEYS.HOTKEYS, { ...CONFIG.DEFAULT_HOTKEYS });

        // Migration: Convert Tab to Home (Tab conflicts with browser)
        if (hotkeyCache.panel === 'Tab' || hotkeyCache.panel === 'tab') {
            hotkeyCache.panel = 'Home';
            safeGM_setValue(CONFIG.STORAGE_KEYS.HOTKEYS, hotkeyCache);
        }

        hotkeyCacheTime = now;
    }
    return hotkeyCache;
}

/**
 * Invalidate hotkey cache
 */
export function invalidateHotkeyCache() {
    hotkeyCache = null;
    hotkeyCacheTime = 0;
}

/**
 * Get hotkey description for UI
 * @param {string} key
 * @returns {string}
 */
export function getHotkeyDescription(key) {
    const descriptions = {
        panel: 'Open settings panel',
        marker: 'Place marker on map',
        info: 'Show location info',
        refresh: 'Refresh coordinates',
        zoomIn: 'Zoom in mini map',
        zoomOut: 'Zoom out mini map',
        copyCoords: 'Copy coordinates',
        googleMaps: 'Open in Google Maps',
        discord: 'Send to Discord',
        autoPlace: 'Auto place marker',
        safePlace: 'Safe place (~50m)'
    };
    return descriptions[key] || '';
}
