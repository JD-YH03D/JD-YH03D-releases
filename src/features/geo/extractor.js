/**
 * BintangToba - Geo Extraction Engine
 * Handles extraction of coordinates from various game components.
 */

import { CONFIG } from '../../core/constants.js';
import { Validators } from '../../common/validators.js';
import { Logger } from '../../core/logger.js';
import { state } from '../../core/state.js';
import { extractionCache } from './cache.js';

/**
 * Deep walk React Fiber tree to find streetview/panorama object
 * @param {Object} fiber
 * @param {number} depth
 * @returns {Object|null}
 */
export function walkFiber(fiber, depth = 0) {
    if (!fiber || depth > CONFIG.LIMITS.FIBER_WALK_MAX_DEPTH) return null;

    try {
        const props = fiber.memoizedProps;
        if (props) {
            if (props.panorama?.location?.latLng) return props.panorama;
            if (props.streetView?.location?.latLng) return props.streetView;
            if (props.children?.props?.panorama?.location?.latLng) return props.children.props.panorama;
        }

        const queue = fiber.updateQueue;
        if (queue?.lastEffect) {
            let effect = queue.lastEffect;
            const seen = new Set();
            do {
                if (seen.has(effect)) break;
                seen.add(effect);
                if (effect.deps) {
                    for (const dep of effect.deps) {
                        if (dep?.location?.latLng) return dep;
                    }
                }
                effect = effect.next;
            } while (effect && effect !== queue.lastEffect);
        }

        const fromSibling = walkFiber(fiber.sibling, depth + 1);
        if (fromSibling) return fromSibling;

        const fromReturn = walkFiber(fiber.return, depth + 1);
        if (fromReturn) return fromReturn;

    } catch (e) {
        // Silent
    }
    return null;
}

/**
 * Extract coordinates from Google Maps StreetView canvas
 */
export function extractFromGoogleSV() {
    try {
        const canvases = document.querySelectorAll('.widget-scene-canvas, canvas[class*="scene"]');
        for (const canvas of canvases) {
            let el = canvas;
            for (let i = 0; i < 10 && el; i++) {
                el = el.parentElement;
                if (!el) break;
                const fiberKey = Object.keys(el).find(k => k.startsWith('__reactFiber'));
                if (fiberKey) {
                    const sv = walkFiber(el[fiberKey], 0);
                    if (sv?.location?.latLng) {
                        const lat = typeof sv.location.latLng.lat === 'function' ? sv.location.latLng.lat() : sv.location.latLng.lat;
                        const lng = typeof sv.location.latLng.lng === 'function' ? sv.location.latLng.lng() : sv.location.latLng.lng;
                        if (Validators.isValidCoord(lat, lng)) return { lat, lng };
                    }
                }
            }
        }
    } catch (e) { /* Silent */ }
    return null;
}

/**
 * Extract coordinates from iframe sources
 */
export function extractFromIframes() {
    const iframes = document.querySelectorAll('iframe');
    for (const iframe of iframes) {
        const src = iframe.src || iframe.getAttribute('data-src') || '';
        if (!src || src.length < 10) continue;

        try {
            const baseUrl = src.startsWith('http') ? src : window.location.origin + src;
            const url = new URL(baseUrl);
            const paramPatterns = [
                { key: 'location', separator: ',' },
                { key: 'cbll', separator: ',' },
                { key: 'viewpoint', separator: ',' },
                { keys: ['lat', 'lng'] },
                { keys: ['lat', 'lon'] }
            ];

            for (const pattern of paramPatterns) {
                if (pattern.key) {
                    const value = url.searchParams.get(pattern.key);
                    if (value) {
                        const parts = value.split(pattern.separator);
                        if (parts.length >= 2) {
                            const lat = parseFloat(parts[0]);
                            const lng = parseFloat(parts[1]);
                            if (Validators.isValidCoord(lat, lng)) return { lat, lng };
                        }
                    }
                } else if (pattern.keys) {
                    const lat = parseFloat(url.searchParams.get(pattern.keys[0]));
                    const lng = parseFloat(url.searchParams.get(pattern.keys[1]));
                    if (Validators.isValidCoord(lat, lng)) return { lat, lng };
                }
            }
        } catch (e) { continue; }
    }
    return null;
}

/**
 * Main entry point for coordinate extraction
 */
export function extractCoordinates() {
    const cached = extractionCache.get();
    if (cached) return cached;

    // Check intercepted XHR first
    if (state.interceptedCoords && Validators.isValidCoord(state.interceptedCoords.lat, state.interceptedCoords.lng)) {
        extractionCache.set(state.interceptedCoords, 'xhr');
        return state.interceptedCoords;
    }

    // Fallback to active extraction strategies
    let result = extractFromGoogleSV() || extractFromIframes();

    if (result) {
        extractionCache.set(result, 'extraction');
    }

    return result;
}
