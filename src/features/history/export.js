/**
 * BintangToba - History Export
 * Handles file downloads and formatting (JSON/CSV) for round history.
 */

import { Logger } from '../../core/logger.js';
import { CONFIG } from '../../core/constants.js';

/**
 * Download text as a file.
 */
export function downloadTextFile(filename, content, mime = 'text/plain;charset=utf-8') {
    try {
        const blob = new Blob([content], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    } catch (e) {
        Logger.error('Download failed:', e.message);
    }
}

/**
 * Export history in specified format.
 */
export function exportHistory(history, format = 'json', platform = 'unknown') {
    if (!history?.length) return;
    const dateKey = new Date().toISOString().replace(/[:.]/g, '-');

    if (format === 'csv') {
        const header = 'round,timestamp_iso,lat,lng,address';
        const rows = history.map((e) => {
            const address = `"${String(e.address || '').replace(/"/g, '""')}"`;
            return `${e.round},${new Date(e.timestamp).toISOString()},${e.lat.toFixed(6)},${e.lng.toFixed(6)},${address}`;
        });
        downloadTextFile(`bintang-history-${dateKey}.csv`, [header, ...rows].join('\n'), 'text/csv;charset=utf-8');
        return;
    }

    const payload = {
        exportedAt: new Date().toISOString(),
        platform,
        total: history.length,
        rounds: history
    };
    downloadTextFile(`bintang-history-${dateKey}.json`, JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
}
