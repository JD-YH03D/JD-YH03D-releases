/**
 * BintangToba - Integrity Manager
 * Handles script hashing, remote manifest verification, and runtime tamper detection.
 */

import { CONFIG } from '../core/constants.js';
import { state } from '../core/state.js';
import { Logger } from '../core/logger.js';
import { telemetryInc } from '../core/telemetry.js';
import { safeGM_getValue, safeGM_setValue } from '../common/storage.js';

let integrityScheduledTimeout = null;
let lastRemoteFetchAt = 0;
let baselineFingerprints = null;
let integrityCheckInterval = null;
let integrityHeartbeatInterval = null;
let protectionErrorHandler = null;
let protectionRejectionHandler = null;

/**
 * Lightweight deterministic hash
 */
export function fnv1aHash(input) {
    let hash = 0x811c9dc5;
    const str = String(input || '');
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return ('00000000' + (hash >>> 0).toString(16)).slice(-8);
}

/**
 * Compare semantic versions
 */
export function compareSemanticVersion(a, b) {
    const pa = String(a || '0.0.0').split('.').map(v => parseInt(v, 10) || 0);
    const pb = String(b || '0.0.0').split('.').map(v => parseInt(v, 10) || 0);
    const len = Math.max(pa.length, pb.length, 3);
    for (let i = 0; i < len; i++) {
        const va = pa[i] || 0;
        const vb = pb[i] || 0;
        if (va > vb) return 1;
        if (va < vb) return -1;
    }
    return 0;
}

/**
 * Convert ArrayBuffer to hex string
 */
function bufferToHex(buffer) {
    const bytes = new Uint8Array(buffer);
    let hex = '';
    for (let i = 0; i < bytes.length; i++) {
        hex += bytes[i].toString(16).padStart(2, '0');
    }
    return hex;
}

/**
 * Generate SHA-256 hash for script source
 */
export async function generateScriptHash(sourceCode) {
    try {
        if (!sourceCode || typeof sourceCode !== 'string') return null;
        if (typeof crypto === 'undefined' || !crypto.subtle || typeof TextEncoder === 'undefined') {
            return null;
        }
        const data = new TextEncoder().encode(sourceCode);
        const digest = await crypto.subtle.digest('SHA-256', data);
        telemetryInc('protection.hashComputed');
        return bufferToHex(digest);
    } catch (e) {
        Logger.debug('Hash generation failed:', e?.message || 'unknown');
        return null;
    }
}

/**
 * Load remote version metadata
 */
export async function loadRemoteVersionMetadata(forceRefresh = false) {
    const now = Date.now();
    const cache = safeGM_getValue(CONFIG.STORAGE_KEYS.REMOTE_VERSION_CACHE, null);

    if (!forceRefresh && cache?.data && cache?.cachedAt && (now - cache.cachedAt) < CONFIG.TIMING.INTEGRITY_CACHE_TTL) {
        return cache.data;
    }

    if (!forceRefresh && (now - lastRemoteFetchAt) < CONFIG.TIMING.INTEGRITY_MIN_FETCH_GAP) {
        return cache?.data || null;
    }

    lastRemoteFetchAt = now;
    // ... logic for GM_xmlhttpRequest fetch from CONFIG.VERSION_METADATA_URL ...
    // Note: In modular mode, this might need a helper for GM_xmlhttpRequest.
    return null; // Placeholder for now - needs full implementation in common/network.js
}

export const IntegrityManager = {
    started: false,
    checking: false,

    async runCheck(reason = 'manual', forceRemote = false) {
        if (this.checking) return;
        this.checking = true;
        telemetryInc('protection.checks');

        try {
            // ... implementation from monolith ...
        } catch (e) {
            Logger.error('[Integrity] Check FAILED:', e);
        } finally {
            this.checking = false;
        }
    },

    // ... other methods ...
};
