/**
 * BintangToba - Protection Registry
 * Manages the initialization and cleanup of security monitors.
 * Ensures no duplicate observers or memory leaks.
 */

import { Logger } from '../core/logger.js';

class ProtectionRegistry {
    constructor() {
        this.monitors = new Map();
        this.isStarted = false;
    }

    /**
     * Register a monitor with init and destroy hooks.
     * @param {string} name 
     * @param {Object} monitor 
     */
    register(name, monitor) {
        if (this.monitors.has(name)) {
            Logger.warn(`Protection monitor "${name}" is already registered.`);
            return;
        }

        if (typeof monitor.init !== 'function' || typeof monitor.destroy !== 'function') {
            Logger.error(`Monitor "${name}" must implement init() and destroy().`);
            return;
        }

        this.monitors.set(name, monitor);
        Logger.debug(`Monitor registered: ${name}`);

        // Auto-init if registry is already started
        if (this.isStarted) {
            monitor.init();
        }
    }

    /**
     * Start all registered monitors.
     */
    startAll() {
        if (this.isStarted) return;
        this.isStarted = true;

        for (const [name, monitor] of this.monitors) {
            try {
                monitor.init();
            } catch (e) {
                Logger.error(`Failed to init monitor "${name}":`, e);
            }
        }
        Logger.info(`Protection Layer started with ${this.monitors.size} monitors.`);
    }

    /**
     * Stop and cleanup all monitors.
     */
    stopAll() {
        if (!this.isStarted) return;

        for (const [name, monitor] of this.monitors) {
            try {
                monitor.destroy();
            } catch (e) {
                Logger.error(`Failed to destroy monitor "${name}":`, e);
            }
        }
        this.isStarted = false;
        Logger.info('Protection Layer stopped and cleaned up.');
    }

    /**
     * Get a specific monitor by name.
     */
    get(name) {
        return this.monitors.get(name);
    }
}

export const Protection = new ProtectionRegistry();
