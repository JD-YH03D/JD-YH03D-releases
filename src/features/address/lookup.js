/**
 * BintangToba - Address Lookup
 * Rate-limited async geocoding via Nominatim.
 */

import { CONFIG } from '../../core/constants.js';
import { state } from '../../core/state.js';
import { Logger } from '../../core/logger.js';
import { Validators } from '../../common/validators.js';

let addressQueue = [];
let addressProcessing = false;
let lastAddressCall = 0;
let addressBackoffMs = 0;
let addressConsecutiveErrors = 0;
const ADDRESS_MAX_BACKOFF = 30000;

/**
 * Lookup address from coordinates.
 */
export async function lookupAddress(lat, lng) {
    return new Promise((resolve, reject) => {
        if (!Validators.isValidCoord(lat, lng)) {
            reject(new Error('Invalid coordinates'));
            return;
        }

        while (addressQueue.length >= CONFIG.LIMITS.ADDRESS_QUEUE_MAX) {
            const stale = addressQueue.shift();
            stale.reject(new Error('Queue overflow'));
        }

        addressQueue.push({ lat, lng, resolve, reject });
        processAddressQueue();
    });
}

function processAddressQueue() {
    if (addressProcessing || addressQueue.length === 0) return;

    const now = Date.now();
    const minInterval = state.platform === 'geoguessr' ? CONFIG.TIMING.ADDRESS_RATE_LIMIT_GEOGUESSR : CONFIG.TIMING.ADDRESS_RATE_LIMIT_DEFAULT;
    const effectiveInterval = Math.max(minInterval, addressBackoffMs);
    const elapsed = now - lastAddressCall;

    if (elapsed >= effectiveInterval) {
        addressProcessing = true;
        const { lat, lng, resolve, reject } = addressQueue.shift();
        const url = `${CONFIG.NOMINATIM_URL}?lat=${lat}&lon=${lng}&format=json&accept-language=en`;

        const handleResponse = (data) => {
            lastAddressCall = Date.now();
            addressProcessing = false;
            addressConsecutiveErrors = 0;
            addressBackoffMs = 0;
            resolve(data);
            setTimeout(processAddressQueue, minInterval);
        };

        const handleError = (error, statusCode) => {
            lastAddressCall = Date.now();
            addressProcessing = false;
            addressConsecutiveErrors++;
            if (statusCode === 429 || addressConsecutiveErrors >= 2) {
                addressBackoffMs = Math.min(ADDRESS_MAX_BACKOFF, Math.max(2000, addressBackoffMs * 2 || 2000));
            }
            reject(error);
            setTimeout(processAddressQueue, Math.max(minInterval, addressBackoffMs));
        };

        // Network implementation simplified for now; will be integrated in build phase
        fetch(url, { headers: { 'Accept': 'application/json' } })
            .then(res => res.ok ? res.json() : Promise.reject({ status: res.status }))
            .then(handleResponse)
            .catch(e => handleError(e, e?.status || 0));
    } else {
        setTimeout(processAddressQueue, effectiveInterval - elapsed);
    }
}

/**
 * Format address object to string.
 */
export function formatAddress(addr) {
    if (!addr?.address) return null;
    const a = addr.address;
    const parts = [a.road || a.street, a.city || a.town || a.village, a.state || a.province, a.country].filter(Boolean);
    return parts.join(', ') || a.country || 'Unknown';
}
