/**
 * BintangToba - App Entry Point
 * Orchestrates initialization, platform detection, and system startup.
 */

import { Logger } from '../core/logger.js';
import { CONFIG } from '../core/constants.js';
import { state } from '../core/state.js';
import { detectPlatform } from '../systems/platform.js';
import { PatchManager } from '../systems/patch-manager.js';
import { IntegrityManager } from '../systems/integrity.js';
import { startMonitoring } from './monitoring.js';
import { handleKeydown } from './components/keyboard.js';
import { updateInfoDisplay } from './layout/phone-frame.js';

let isInitialized = false;

export function init() {
    if (isInitialized) return;
    isInitialized = true;

    Logger.initDebugFlag();
    state.platform = detectPlatform();

    Logger.info('========================================');
    Logger.info(`${CONFIG.NAME} v${CONFIG.VERSION}`);
    Logger.info('Platform:', state.platform);
    Logger.info('========================================');

    // Startup sequence
    if (state.runtime?.flags?.USE_PATCH_MANAGER) {
        PatchManager.ensureXHRPatch();
    }

    IntegrityManager.init();

    // Phase 4: Protection Layer
    import('../protection/registry.js').then(({ Protection }) => {
        import('../protection/runtime/spa-monitor.js').then(({ spaMonitor }) => {
            Protection.register('spa-monitor', spaMonitor);
            Protection.startAll();
        });
    });

    // Register global listeners
    window.addEventListener('keydown', handleKeydown, true);

    // Initial display setup
    if (state.infoVisible) {
        updateInfoDisplay();
    }

    // Start background systems
    startMonitoring();

    Logger.info('BintangToba initialization complete');
}

export function cleanup() {
    window.removeEventListener('keydown', handleKeydown, true);

    // Stop protection
    import('../protection/registry.js').then(({ Protection }) => {
        Protection.stopAll();
    });

    isInitialized = false;
}
