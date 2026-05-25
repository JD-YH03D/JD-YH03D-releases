/**
 * BintangToba - Map Pin Engine
 * Handles programmatic interaction with the game map (Google Maps).
 */

import { Logger } from '../../core/logger.js';
import { CONFIG } from '../../core/constants.js';
import { state } from '../../core/state.js';
import { Validators } from '../../common/validators.js';
import { extractCoordinates } from '../geo/extractor.js';

/**
 * Resolve the Google Maps instance from a React Fiber tree.
 */
export function resolveGoogleMapFromFiber(domNode, maxDepth = 8) {
    if (!domNode) return null;
    const fiberKey = Object.keys(domNode).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
    if (!fiberKey) return null;

    let fiber = domNode[fiberKey];
    for (let depth = 0; fiber && depth < maxDepth; depth++) {
        try {
            const props = fiber.memoizedProps;
            if (props?.map && typeof props.map === 'object') {
                if (props.map.__e3_ || props.map.getCenter || props.map.setCenter) return props.map;
            }
            if (fiber.stateNode?.map && fiber.stateNode.map.__e3_) return fiber.stateNode.map;
        } catch (_) { }
        fiber = fiber.return;
    }
    return null;
}

/**
 * Build a synthetic Google Maps click-event payload.
 */
export function buildSyntheticMapEvent(lat, lng) {
    return {
        latLng: {
            lat: () => lat,
            lng: () => lng,
            toJSON: () => ({ lat, lng }),
            toString: () => `(${lat}, ${lng})`
        },
        stop: null,
        pixel: null
    };
}

/**
 * Dispatch click listeners on a Google Maps instance.
 */
export function dispatchToClickListeners(mapInst, syntheticEvent) {
    const registryKeys = ['__e3_', '__listeners_', 'gm_bindings_'];
    let invoked = false;
    for (const regKey of registryKeys) {
        const registry = mapInst[regKey];
        if (!registry || typeof registry !== 'object') continue;
        const clickBucket = registry.click;
        if (!clickBucket || typeof clickBucket !== 'object') continue;

        const bucketKeys = Object.keys(clickBucket);
        for (let i = bucketKeys.length - 1; i >= 0; i--) {
            const entry = clickBucket[bucketKeys[i]];
            if (!entry || typeof entry !== 'object') continue;
            for (const fk of Object.keys(entry)) {
                if (typeof entry[fk] === 'function') {
                    try {
                        entry[fk](syntheticEvent);
                        invoked = true;
                    } catch (err) { }
                }
            }
        }
        if (invoked) break;
    }
    return invoked;
}

/**
 * Locate the guess-map DOM node.
 */
export function locateGuessMapNode() {
    const candidates = [
        '[class^="guess-map_canvas"]',
        '[class*="guess-map_canvas"]',
        '[data-qa="guess-map"] [class*="canvas"]',
        '[class*="region-map_mapCanvas"]',
        '[class*="map_canvas__"]'
    ];
    for (const sel of candidates) {
        const nodes = document.querySelectorAll(sel);
        for (const node of nodes) {
            const r = node.getBoundingClientRect();
            if (r.width > 30 && r.height > 30) return node;
        }
    }
    return null;
}

/**
 * Apply a randomized offset to coordinates.
 */
export function jitterCoordinates(lat, lng) {
    const maxR = CONFIG.MAP.SAFE_MODE_OFFSET_DEGREES;
    const angle = Math.random() * 2 * Math.PI;
    const radius = maxR * Math.sqrt(Math.random());
    return {
        lat: lat + radius * Math.cos(angle),
        lng: lng + radius * Math.sin(angle)
    };
}

/**
 * Pin a guess on the game map.
 */
export function pinGuessToGameMap(lat, lng) {
    const mapNode = locateGuessMapNode();
    if (!mapNode) return false;
    const gMapInst = resolveGoogleMapFromFiber(mapNode, 10);
    if (!gMapInst) return false;

    const synEvent = buildSyntheticMapEvent(lat, lng);
    return dispatchToClickListeners(gMapInst, synEvent);
}

/**
 * Toggle the internal marker visibility on the game map.
 */
export function toggleMarker() {
    const coords = extractCoordinates();
    if (!coords || !Validators.isValidCoord(coords.lat, coords.lng)) {
        Logger.warn('Cannot toggle marker: invalid coordinates');
        return false;
    }

    // In modular version, this might trigger a specific UI overlay
    // For now, we use pinGuessToGameMap as a placeholder or direct interaction
    return pinGuessToGameMap(coords.lat, coords.lng);
}

/**
 * Place a guess on the game map, optionally with a randomized offset.
 */
export function placeGuessOnMap(isSafe = false) {
    let coords = extractCoordinates();
    if (!coords || !Validators.isValidCoord(coords.lat, coords.lng)) {
        Logger.warn('Cannot place guess: invalid coordinates');
        return false;
    }

    if (isSafe || state.features?.safeMode) {
        coords = jitterCoordinates(coords.lat, coords.lng);
    }

    return pinGuessToGameMap(coords.lat, coords.lng);
}
