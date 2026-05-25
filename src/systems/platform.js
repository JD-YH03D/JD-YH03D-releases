import { state } from '../core/state.js';
import { locateGuessMapNode, resolveGoogleMapFromFiber } from '../features/map/pin-engine.js';

export function detectPlatform() {
    const host = window.location.hostname;

    if (host.includes('geoguessr.com')) return 'geoguessr';
    if (host.includes('worldguessr.com') || host.includes('worldguessr.net')) return 'worldguessr';
    if (host.includes('openguessr.com')) return 'openguessr';
    if (host.includes('freeguessr.com')) return 'freeguessr';
    if (host.includes('geoduels.io')) return 'geoduels';
    if (host.includes('guesswhereyouare.com')) return 'guesswhere';

    return 'unknown';
}

/**
 * Locate and cache the active Google Maps instance.
 */
export function findMapInstance() {
    const node = locateGuessMapNode();
    if (node) {
        const inst = resolveGoogleMapFromFiber(node, 10);
        if (inst) {
            state.gameMap = inst;
            return inst;
        }
    }
    return null;
}
