/**
 * BintangToba - Keyboard Handler
 * Manages hotkey execution and input field detection.
 */

import { Logger } from '../../core/logger.js';
import { CONFIG } from '../../core/constants.js';
import { state } from '../../core/state.js';
import { Throttle } from '../../common/throttle.js';
import { getHotkeys, normalizeHotkey } from '../../systems/hotkeys.js';
import { togglePanel, openHomeQuick, refreshLocation } from '../components/controls.js';
import { sendToDiscord } from '../components/discord.js';
import { findMapInstance } from '../../systems/platform.js';
import { toggleMarker, placeGuessOnMap } from '../../features/map/pin-engine.js';
import { extractCoordinates } from '../../features/geo/extractor.js';
import { Validators } from '../../common/validators.js';

let lastKeydownTime = 0;

export function handleKeydown(e) {
    // Skip if in input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
    }

    const now = Date.now();
    if (now - lastKeydownTime < CONFIG.TIMING.KEYDOWN_DEBOUNCE) return;
    lastKeydownTime = now;

    const hotkeys = getHotkeys();
    const key = normalizeHotkey(e.key);

    const hkMap = {};
    for (const [action, hk] of Object.entries(hotkeys)) {
        hkMap[action] = normalizeHotkey(hk);
    }

    // Actions
    if (hkMap.panel && key === hkMap.panel) {
        e.preventDefault();
        togglePanel();
        return;
    }

    if (hkMap.marker && key === hkMap.marker) {
        e.preventDefault();
        if (!state.gameMap) findMapInstance();
        toggleMarker();
        return;
    }

    if (hkMap.refresh && key === hkMap.refresh && state.infoVisible) {
        e.preventDefault();
        refreshLocation();
        return;
    }

    if (hkMap.info && key === hkMap.info) {
        e.preventDefault();
        openHomeQuick();
        return;
    }

    if (hkMap.copyCoords && key === hkMap.copyCoords) {
        e.preventDefault();
        const coords = extractCoordinates();
        if (coords && Validators.isValidCoord(coords.lat, coords.lng)) {
            navigator.clipboard.writeText(`${coords.lat}, ${coords.lng}`);
        }
        return;
    }

    if (hkMap.googleMaps && key === hkMap.googleMaps) {
        e.preventDefault();
        const coords = extractCoordinates();
        if (coords && Validators.isValidCoord(coords.lat, coords.lng)) {
            window.open(`https://www.google.com/maps?q=${coords.lat},${coords.lng}`, '_blank');
        }
        return;
    }

    if (hkMap.autoPlace && key === hkMap.autoPlace) {
        e.preventDefault();
        if (state.features?.autoMarker) {
            placeGuessOnMap(false);
        } else {
            if (!state.gameMap) findMapInstance();
            toggleMarker();
        }
        return;
    }

    if (hkMap.safePlace && key === hkMap.safePlace) {
        e.preventDefault();
        if (state.features?.autoMarker) {
            placeGuessOnMap(true);
        } else {
            const prev = !!state.features?.safeMode;
            state.features.safeMode = true;
            if (!state.gameMap) findMapInstance();
            toggleMarker();
            state.features.safeMode = prev;
        }
        return;
    }

    if (hkMap.zoomIn && key === hkMap.zoomIn && state.miniMapVisible) {
        e.preventDefault();
        state.miniMap?.zoomIn();
        return;
    }

    if (hkMap.zoomOut && key === hkMap.zoomOut && state.miniMapVisible) {
        e.preventDefault();
        state.miniMap?.zoomOut();
        return;
    }

    if (hkMap.discord && key === hkMap.discord) {
        e.preventDefault();
        sendToDiscord();
        return;
    }
}
