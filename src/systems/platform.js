/**
 * BintangToba - Platform Detection
 * Identifies the current gaming platform (GeoGuessr, WorldGuessr, etc.).
 */

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
