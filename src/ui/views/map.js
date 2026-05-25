/**
 * BintangToba - Map View
 * Template for the primary location tracking and mini-map interface.
 */

import { Security } from '../../common/security.js';

export function createMapView(state) {
    const view = document.createElement('div');
    view.id = 'geohelper-map-view';
    view.style.cssText = `min-width: 100%; display: flex; flex-direction: column; background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);`;

    view.innerHTML = `
        <div id="geohelper-minimap-container" style="height: 280px; position: relative; background: #cbd5e1; flex-shrink: 0; overflow: hidden;">
            <div id="geohelper-minimap" style="width:100%;height:100%;"></div>
            <div id="geohelper-status-badge" style="position:absolute;top:12px;left:12px;background:rgba(74,222,128,0.95);padding:4px 10px;border-radius:6px;font-size:11px;color:#064e3b;font-weight:800;z-index:1000;">✓ Ready</div>
            <div id="geohelper-coords-overlay" style="position:absolute;bottom:12px;left:12px;background:rgba(255,255,255,0.9);padding:4px 10px;border-radius:6px;font-family:monospace;font-size:11px;color:#1f2937;font-weight:700;z-index:1000;">--, --</div>
        </div>
        <div id="geohelper-location-info" style="flex: 1; background: #fff; padding: 12px 16px; overflow-y: auto;">
            <div style="text-align:center;padding:20px 10px;">
                <div style="font-size:32px;margin-bottom:8px;">🌍</div>
                <div style="color:#6b7280;font-size:13px;font-weight:500;">Waiting for location...</div>
            </div>
        </div>
    `;

    return view;
}
