/**
 * BintangToba - Mini Map
 * Handles Leaflet initialization, layer management, and position updates.
 */

import { Logger } from '../../core/logger.js';
import { CONFIG } from '../../core/constants.js';
import { state } from '../../core/state.js';
import { Validators } from '../../common/validators.js';
import { extractCoordinates } from '../geo/extractor.js';

let leafletInitializing = false;

/**
 * Initialize mini map with Leaflet.
 */
export function initMiniMap() {
    if (typeof L !== 'undefined') {
        setupMiniMap();
        return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CONFIG.LEAFLET_CSS;
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = CONFIG.LEAFLET_JS;

    const pollInterval = setInterval(() => {
        if (typeof L !== 'undefined' && L.map) {
            clearInterval(pollInterval);
            setupMiniMap();
        }
    }, CONFIG.TIMING.LEAFLET_POLL_INTERVAL);

    document.head.appendChild(script);
}

/**
 * Setup mini map after Leaflet is loaded.
 */
export function setupMiniMap() {
    if (state.miniMap || typeof L === 'undefined' || leafletInitializing) return;
    leafletInitializing = true;

    try {
        state.miniMap = L.map('geohelper-minimap', {
            zoomControl: false,
            attributionControl: false,
            zoomAnimation: true,
            fadeAnimation: true,
            minZoom: CONFIG.MAP.MIN_ZOOM,
            worldCopyJump: true
        });

        // applyMiniMapLayer is assumed to be imported or available
        state.miniMap.setView([0, 0], CONFIG.MAP.WORLD_VIEW_ZOOM);
        leafletInitializing = false;
    } catch (e) {
        leafletInitializing = false;
        Logger.error('Mini map setup error:', e);
    }
}

/**
 * Update mini map position and marker.
 */
export function updateMiniMap() {
    if (!state.miniMap) return;

    const coords = extractCoordinates();
    if (!coords || !Validators.isValidCoord(coords.lat, coords.lng)) return;

    const currentCenter = state.miniMap.getCenter();
    const dist = Math.abs(currentCenter.lat - coords.lat) + Math.abs(currentCenter.lng - coords.lng);

    if (dist > CONFIG.MAP.PAN_THRESHOLD) {
        if (dist < CONFIG.MAP.JUMP_THRESHOLD) {
            state.miniMap.panTo([coords.lat, coords.lng], { animate: true, duration: 0.5 });
        } else {
            state.miniMap.setView([coords.lat, coords.lng], CONFIG.MAP.DEFAULT_ZOOM);
        }
    }

    if (state.miniMapMarker) {
        state.miniMapMarker.setLatLng([coords.lat, coords.lng]);
    } else {
        state.miniMapMarker = L.marker([coords.lat, coords.lng]).addTo(state.miniMap);
    }

    const overlay = document.getElementById('geohelper-coords-overlay');
    if (overlay) {
        overlay.textContent = `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`;
    }
}
