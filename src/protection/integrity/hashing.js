/**
 * BintangToba - Integrity Hashing
 * Handles local script fingerprinting and SHA-256 validation.
 */

import { Logger } from '../../core/logger.js';

class IntegrityHashing {
    constructor() {
        this.baseline = null;
    }

    init() {
        Logger.debug('Integrity Hashing monitor initialized');
    }

    /**
     * Generate SHA-256 hash of a string.
     */
    async generateHash(text) {
        const msgUint8 = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Get the source code of the current runtime (if available via GM_info).
     */
    async getRuntimeSource() {
        try {
            // Check GM_info for script source (Tampermonkey specific)
            return typeof GM_info !== 'undefined' ?
                (GM_info.scriptSource || GM_info.script?.code || '') : '';
        } catch (e) {
            return '';
        }
    }

    async validateIntegrity(expectedHash) {
        const source = await this.getRuntimeSource();
        if (!source) return true; // Fail-safe (can't validate)

        const currentHash = await this.generateHash(source);
        return currentHash === expectedHash;
    }

    destroy() {
        Logger.debug('Integrity Hashing monitor destroyed');
    }
}

export const integrityHashing = new IntegrityHashing();
