/**
 * BintangToba - Round History Manager
 * Handles persistence, deduplication, and normalization of game rounds.
 */

import { state } from '../../core/state.js';
import { CONFIG } from '../../core/constants.js';
import { Validators } from '../../common/validators.js';
import { Security } from '../../common/security.js';

/**
 * Add entry to round history.
 */
export function addRoundHistoryEntry(coords, addressLabel = 'Unknown location') {
    if (!coords || !Validators.isValidCoord(coords.lat, coords.lng)) return;

    const lastEntry = state.roundHistory[0] || null;
    if (lastEntry) {
        const veryClose = Math.abs(lastEntry.lat - coords.lat) < 0.00001 &&
            Math.abs(lastEntry.lng - coords.lng) < 0.00001;
        if (veryClose) return;
    }

    const nextRoundNumber = (state.roundHistory[0]?.round || 0) + 1;
    const entry = {
        round: nextRoundNumber,
        lat: coords.lat,
        lng: coords.lng,
        address: addressLabel,
        timestamp: Date.now()
    };

    state.roundHistory.unshift(entry);
    if (state.roundHistory.length > CONFIG.LIMITS.HISTORY_MAX_ITEMS) {
        state.roundHistory.length = CONFIG.LIMITS.HISTORY_MAX_ITEMS;
    }
}

/**
 * Normalize round numbers in sequence.
 */
export function normalizeRoundSequence(history) {
    return history.map((entry, idx, arr) => ({
        ...entry,
        round: arr.length - idx
    }));
}

/**
 * Merge two history arrays.
 */
export function mergeRoundHistory(existing, imported) {
    const combined = [...existing, ...imported].sort((a, b) => b.timestamp - a.timestamp);
    const seen = new Set();
    const deduped = [];
    for (const entry of combined) {
        const key = `${entry.lat.toFixed(6)}|${entry.lng.toFixed(6)}|${Math.floor(entry.timestamp / 1000)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        deduped.push(entry);
        if (deduped.length >= CONFIG.LIMITS.HISTORY_MAX_ITEMS) break;
    }
    return normalizeRoundSequence(deduped);
}
