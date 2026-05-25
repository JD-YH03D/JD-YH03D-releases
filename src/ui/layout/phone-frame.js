/**
 * BintangToba - Phone Layout
 * Main container, screen frame, status bar, and navigation controller.
 */

import { CONFIG } from '../../core/constants.js';
import { state } from '../../core/state.js';
import { Security } from '../../common/security.js';

/**
 * Update the main info display visibility and content.
 */
export function updateInfoDisplay() {
    let frame = document.getElementById('geohelper-phone-frame');
    if (!frame) {
        frame = createPhoneLayout();
    }
    frame.style.display = state.infoVisible ? 'block' : 'none';
}

/**
 * Create the main phone-style layout frame.
 */
export function createPhoneLayout() {
    const frame = document.createElement('div');
    frame.id = 'geohelper-phone-frame';
    frame.style.cssText = `
        position: fixed; top: 20px; right: 20px; width: 320px;
        background: #000; border-radius: 30px; padding: 10px;
        z-index: 999998; box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        border: 3px solid #1a1a1a; user-select: none;
    `;

    const screen = document.createElement('div');
    screen.style.cssText = `
        background: #fff; border-radius: 25px; overflow: hidden;
        height: 520px; position: relative;
    `;

    // Status Bar
    const status = document.createElement('div');
    status.className = 'geohelper-status-bar';
    status.style.cssText = `
        background: #000; color: #fff; padding: 8px 16px;
        display: flex; justify-content: space-between; align-items: center;
        font-size: 11px; font-weight: 600; cursor: grab;
    `;
    status.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;">
            <div id="geohelper-led-indicator" style="width:6px;height:6px;border-radius:50%;background:#4ade80;"></div>
            <span id="geohelper-clock">12:00</span>
        </div>
        <span style="font-size:10px;opacity:0.6;">${CONFIG.NAME}</span>
    `;

    const content = document.createElement('div');
    content.id = 'geohelper-content-area';
    content.style.cssText = `height: calc(100% - 35px); overflow: hidden; position: relative;`;

    screen.appendChild(status);
    screen.appendChild(content);
    frame.appendChild(screen);
    document.body.appendChild(frame);

    return frame;
}
