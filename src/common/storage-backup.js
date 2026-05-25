/**
 * BintangToba - Storage Backup
 * Handles complete session snapshots (settings + history).
 */

import { Logger } from '../core/logger.js';
import { CONFIG } from '../core/constants.js';
import { state } from '../core/state.js';
import { Storage } from './storage.js';
import { downloadTextFile } from '../features/history/export.js';

/**
 * Create a snapshot of the current session.
 */
export function buildSessionSnapshot() {
    return {
        exportedAt: new Date().toISOString(),
        app: CONFIG.NAME,
        version: CONFIG.VERSION,
        platform: state.platform,
        settings: {
            features: { ...state.features },
            currentPreset: state.currentPreset,
            currentMapLayer: state.currentMapLayer,
            themeMode: state.themeMode,
            uiScale: state.uiScale,
            discordWebhook: Storage.get(CONFIG.STORAGE_KEYS.DISCORD_WEBHOOK, '')
        },
        history: [...state.roundHistory]
    };
}

/**
 * Export full session backup file.
 */
export function exportSessionBackup() {
    const snapshot = buildSessionSnapshot();
    const dateKey = new Date().toISOString().replace(/[:.]/g, '-');
    downloadTextFile(
        `bintang-session-backup-${dateKey}.json`,
        JSON.stringify(snapshot, null, 2),
        'application/json;charset=utf-8'
    );
}

/**
 * Import session backup from JSON string.
 */
export function importSessionBackup(jsonText) {
    try {
        const parsed = JSON.parse(jsonText);
        const s = parsed.settings;
        if (s) {
            if (s.features) state.features = { ...state.features, ...s.features };
            if (s.currentPreset) state.currentPreset = s.currentPreset;
            if (s.currentMapLayer) state.currentMapLayer = s.currentMapLayer;
            if (s.themeMode) state.themeMode = s.themeMode;
            if (s.uiScale) state.uiScale = s.uiScale;
            if (s.discordWebhook) Storage.set(CONFIG.STORAGE_KEYS.DISCORD_WEBHOOK, s.discordWebhook);
        }
        if (parsed.history) {
            state.roundHistory = parsed.history;
        }
        Logger.info('Session backup restored');
    } catch (e) {
        Logger.error('Session restore failed:', e);
    }
}
