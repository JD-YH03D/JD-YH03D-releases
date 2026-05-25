/**
 * BintangToba - SPA Monitor
 * Detects URL changes in Single Page Applications (SPA) using MutationObserver.
 * Replaces high-frequency URL polling.
 */

import { Logger } from '../../core/logger.js';
import { state } from '../../core/state.js';
import { findMapInstance } from '../../systems/platform.js';
import { PatchManager } from '../../systems/patch-manager.js';

class SPAMonitor {
    constructor() {
        this.observer = null;
        this.lastUrl = window.location.href;
    }

    init() {
        if (this.observer) return;

        this.observer = new MutationObserver(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== this.lastUrl) {
                this.handleNavigation(currentUrl);
            }
        });

        this.observer.observe(document, { subtree: true, childList: true });
        Logger.debug('SPA Monitor initialized (MutationObserver)');
    }

    handleNavigation(newUrl) {
        Logger.debug('SPA navigation detected:', newUrl);
        this.lastUrl = newUrl;

        // Verify XHR interceptor stability
        if (state.runtime?.flags?.USE_PATCH_MANAGER) {
            PatchManager.ensureXHRPatch();
        }

        // Reset extraction state if needed
        state.gameMap = null;

        // Re-find map after DOM settling
        setTimeout(() => findMapInstance(), 2000);
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        Logger.debug('SPA Monitor destroyed');
    }
}

export const spaMonitor = new SPAMonitor();
