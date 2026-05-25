/**
 * BintangToba - UI Controls
 * Handles location refreshing and panel visibility toggling.
 */

import { Logger } from '../../core/logger.js';
import { CONFIG } from '../../core/constants.js';
import { state } from '../../core/state.js';
import { Throttle } from '../../common/throttle.js';
import { Validators } from '../../common/validators.js';
import { extractCoordinates } from '../../features/geo/extractor.js';
import { lookupAddress } from '../../features/address/lookup.js';
import { updateStatusText, updateLedIndicator } from './indicators.js';
import { updateMiniMap } from '../../features/map/mini-map.js';

let refreshRequestId = 0;

export function refreshLocation() {
    if (!Throttle.canRun('refresh_location', 800)) return;

    const requestId = ++refreshRequestId;
    Logger.info('Refreshing location...');

    updateLedIndicator('refreshing');

    // Reset state
    state.coords = { lat: null, lng: null };
    state.address = null;
    state.markerPlacedThisRound = false;

    // Async extraction
    setTimeout(async () => {
        if (requestId !== refreshRequestId) return;
        const newCoords = extractCoordinates();
        if (newCoords && Validators.isValidCoord(newCoords.lat, newCoords.lng)) {
            state.coords = newCoords;
            try {
                state.address = await lookupAddress(newCoords.lat, newCoords.lng);
            } catch (e) { }

            updateMiniMap();
            updateLedIndicator('ready');
            updateStatusText('Ready', '#4ade80');
        } else {
            updateLedIndicator('waiting');
            updateStatusText('Waiting...', '#9ca3af');
        }
    }, 2000);
}

export function togglePanel() {
    if (!Throttle.canRun('toggle_panel', CONFIG.COOLDOWNS.TOGGLE_PANEL)) return;
    state.infoVisible = !state.infoVisible;
    // updateInfoDisplay() implementation depends on final layout
}

/**
 * Switch UI to home/map view quickly.
 */
export function openHomeQuick() {
    if (!Throttle.canRun('open_home', 300)) return;
    state.infoVisible = true;
    state.phoneView = 'map';
}
