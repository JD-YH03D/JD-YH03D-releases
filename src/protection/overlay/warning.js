/**
 * BintangToba - Protection Overlay
 * Modern glassmorphism UI for alerting users about integrity violations.
 */

import { Security } from '../../common/security.js';

class ProtectionOverlay {
    constructor() {
        this.overlay = null;
    }

    init() {
        // Ready to be triggered
    }

    /**
     * Show a critical integrity warning.
     * @param {string} title 
     * @param {string} message 
     */
    show(title, message) {
        if (this.overlay) return;

        this.overlay = document.createElement('div');
        this.overlay.id = 'btp-protection-overlay';
        this.overlay.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            width: 90%; max-width: 400px; padding: 20px;
            background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 16px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            z-index: 1000000; color: #fff; font-family: sans-serif;
            text-align: center; animation: btpFadeIn 0.5s ease;
        `;

        this.overlay.innerHTML = `
            <div style="font-size:32px;margin-bottom:12px;">🛡️</div>
            <div style="font-weight:bold;font-size:18px;margin-bottom:8px;">${Security.escapeHtml(title)}</div>
            <div style="font-size:13px;line-height:1.5;margin-bottom:16px;opacity:0.9;">${Security.escapeHtml(message)}</div>
            <button id="btp-overlay-dismiss" style="
                background: rgba(255, 255, 255, 0.3); border: none;
                padding: 8px 20px; border-radius: 8px; color: #fff;
                cursor: pointer; font-weight: 600;
            ">Dismiss</button>
        `;

        document.body.appendChild(this.overlay);

        const btn = this.overlay.querySelector('#btp-overlay-dismiss');
        if (btn) btn.onclick = () => this.destroy();
    }

    destroy() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
    }
}

export const protectionOverlay = new ProtectionOverlay();
