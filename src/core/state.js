/**
 * BintangToba - Runtime State
 * Single source of truth for runtime application state.
 */

import { CONFIG } from './constants.js';

export let state = {
    // Platform detection
    platform: null,

    // Coordinates & location
    coords: { lat: null, lng: null },
    address: null,

    // Map references
    gameMap: null,
    marker: null,
    miniMap: null,
    miniMapTileLayer: null,
    miniMapMarker: null,

    // UI state
    panel: null,
    infoVisible: false,
    miniMapVisible: false,
    phoneView: 'map',
    swapPhoneView: null,

    // Settings
    hotkeys: null,
    features: null,
    currentPreset: CONFIG.DEFAULTS.PRESET,
    currentMapLayer: CONFIG.DEFAULTS.MAP_LAYER,
    themeMode: CONFIG.DEFAULTS.THEME,
    uiScale: CONFIG.DEFAULTS.UI_SCALE,

    // History
    roundHistory: [],
    lastImportBackup: null,

    // Flags
    markerPlacedThisRound: false,
    _pendingAddressCoords: null,

    // Runtime stabilization state
    runtime: {
        flags: { ...CONFIG.FLAGS },
        degraded: false,
        degradedReason: null,
        lastDegradedAt: 0,
        protection: {
            blocked: false,
            forceUpdate: false,
            modifiedBuild: false,
            outdated: false,
            reason: null,
            message: '',
            localHash: null,
            remoteHash: null,
            currentVersion: CONFIG.VERSION,
            latestVersion: CONFIG.VERSION,
            checkedAt: 0,
            sourceAvailable: false
        }
    }
};
