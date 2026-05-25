/**
 * BintangToba - Validation Utilities
 * Type and value validation for core data structures.
 */

import { CONFIG } from '../core/constants.js';

export const Validators = {
    /**
     * Check if coordinates are valid
     * @param {number} lat
     * @param {number} lng
     * @returns {boolean}
     */
    isValidCoord(lat, lng) {
        return typeof lat === 'number' && typeof lng === 'number' &&
            !isNaN(lat) && !isNaN(lng) &&
            lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    },

    /**
     * Check if object is a valid preset
     * @param {string} presetName
     * @returns {boolean}
     */
    isValidPreset(presetName) {
        return presetName && CONFIG.PRESETS.hasOwnProperty(presetName);
    },

    /**
     * Check if object is a valid map layer
     * @param {string} layerName
     * @returns {boolean}
     */
    isValidMapLayer(layerName) {
        return layerName && CONFIG.MAP_LAYERS.hasOwnProperty(layerName);
    },

    /**
     * Check if object is a valid theme
     * @param {string} themeName
     * @returns {boolean}
     */
    isValidTheme(themeName) {
        return themeName && (themeName === 'dark' || themeName === 'colorful');
    },

    /**
     * Check if object is a valid UI scale
     * @param {string} scaleName
     * @returns {boolean}
     */
    isValidUiScale(scaleName) {
        return scaleName && CONFIG.UI_SCALES.hasOwnProperty(scaleName);
    },

    /**
     * Compare coordinates with small tolerance to avoid float noise mismatch.
     * @param {{lat:number,lng:number}|null} a
     * @param {{lat:number,lng:number}|null} b
     * @returns {boolean}
     */
    areCoordsEquivalent(a, b) {
        if (!a && !b) return true;
        if (!a || !b) return false;
        if (!this.isValidCoord(a.lat, a.lng) || !this.isValidCoord(b.lat, b.lng)) return false;
        return Math.abs(a.lat - b.lat) < 0.000001 && Math.abs(a.lng - b.lng) < 0.000001;
    }
};
