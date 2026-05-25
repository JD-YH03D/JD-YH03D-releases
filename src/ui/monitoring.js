/**
 * BintangToba - Monitoring Loop
 * Handles periodic coordinate polling, round detection, and self-healing.
 */

import { Logger } from '../core/logger.js';
import { CONFIG } from '../core/constants.js';
import { state } from '../core/state.js';
import { Validators } from '../common/validators.js';
import { extractCoordinates } from '../features/geo/extractor.js';
import { lookupAddress } from '../features/address/lookup.js';
import { addRoundHistoryEntry } from '../features/history/manager.js';
import { updateMiniMap } from '../features/map/mini-map.js';
import { updateLedIndicator } from './components/indicators.js';
import { findMapInstance } from '../systems/platform.js';

let monitoringInterval = null;
let monitoringBusy = false;
let lastCoords = { lat: null, lng: null };
let monitoringFailCount = 0;
let monitoringLastValidCoords = null;

export function startMonitoring() {
    if (monitoringInterval) clearInterval(monitoringInterval);

    monitoringInterval = setInterval(async () => {
        if (monitoringBusy) return;
        monitoringBusy = true;

        try {
            const coords = extractCoordinates();
            if (coords && Validators.isValidCoord(coords.lat, coords.lng)) {
                monitoringFailCount = 0;
                const changed = coords.lat !== lastCoords.lat || coords.lng !== lastCoords.lng;

                if (changed) {
                    lastCoords = { ...coords };
                    state.coords = { ...coords };

                    let isNewRound = !monitoringLastValidCoords;
                    if (monitoringLastValidCoords) {
                        const distance = Math.abs(coords.lat - monitoringLastValidCoords.lat) +
                            Math.abs(coords.lng - monitoringLastValidCoords.lng);
                        if (distance > CONFIG.MAP.NEW_ROUND_THRESHOLD) {
                            isNewRound = true;
                            state.markerPlacedThisRound = false;
                            state.address = null;
                        }
                    }

                    if (isNewRound) {
                        addRoundHistoryEntry(coords);
                    }
                    monitoringLastValidCoords = { ...coords };

                    try {
                        state.address = await lookupAddress(coords.lat, coords.lng);
                    } catch (e) { }

                    if (state.miniMapVisible) updateMiniMap();
                    updateLedIndicator('ready');
                }
            } else {
                monitoringFailCount++;
                if (monitoringFailCount % 20 === 5 && !state.gameMap) {
                    findMapInstance();
                }
            }
        } catch (e) {
            Logger.error('Monitoring error:', e);
        } finally {
            monitoringBusy = false;
        }
    }, CONFIG.TIMING.MONITORING_INTERVAL);
}

export function stopMonitoring() {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
    }
}
