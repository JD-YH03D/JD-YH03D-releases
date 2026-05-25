/**
 * BintangToba - Extraction Cache
 * Cache for coordinate extraction results to improve performance.
 */

import { CONFIG } from '../../core/constants.js';

export const extractionCache = {
    result: null,
    source: null,
    timestamp: 0,
    hits: 0,
    misses: 0,

    /**
     * Get cached result if still valid
     * @returns {{ lat: number, lng: number } | null}
     */
    get() {
        if (this.result && (Date.now() - this.timestamp) < CONFIG.TIMING.EXTRACTION_CACHE_TTL) {
            this.hits++;
            return this.result;
        }
        return null;
    },

    /**
     * Store result in cache
     * @param {{ lat: number, lng: number }} result
     * @param {string} source
     */
    set(result, source) {
        this.result = result;
        this.source = source;
        this.timestamp = Date.now();
        this.misses++;
    },

    /**
     * Invalidate cache
     */
    invalidate() {
        this.result = null;
        this.source = null;
        this.timestamp = 0;
    },

    /**
     * Get cache statistics
     * @returns {{ hits: number, misses: number, hitRate: string }}
     */
    getStats() {
        const total = this.hits + this.misses;
        const hitRate = total > 0 ? ((this.hits / total) * 100).toFixed(1) + '%' : 'N/A';
        return { hits: this.hits, misses: this.misses, hitRate };
    }
};
