/**
 * BintangToba - Debug Bridge
 * Provides a window-level API for runtime inspection and diagnostics.
 */

import { CONFIG } from './constants.js';
import { state } from './state.js';
import { telemetrySnapshot } from './telemetry.js';
import { IntegrityManager } from '../systems/integrity.js';

export function installDebugBridge() {
    const pageWindow = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

    const bridge = {
        version: CONFIG.VERSION,
        getTelemetry: () => telemetrySnapshot(),
        getFlags: () => ({ ...state.runtime?.flags }),
        runIntegrityCheck: (reason) => IntegrityManager.runCheck(reason, true),
        getSummary: () => ({
            platform: state.platform,
            init: true,
            visible: state.infoVisible,
            coords: !!state.coords?.lat
        })
    };

    window.__btpDebug = bridge;
    pageWindow.__btpDebug = bridge;
}

export function uninstallDebugBridge() {
    delete window.__btpDebug;
    const pageWindow = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
    delete pageWindow.__btpDebug;
}
