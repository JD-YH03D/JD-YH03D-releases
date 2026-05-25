/**
 * BintangToba - UI Indicators
 * Handles visual state updates for the LED and status text.
 */

export function updateStatusText(text, color) {
    const el = document.getElementById('geohelper-status-text');
    const badge = document.getElementById('geohelper-status-badge');

    if (el) {
        el.textContent = text;
        el.style.color = color;
    }

    if (badge) {
        badge.textContent = text.includes('Ready') ? '✓ Ready' : text.includes('Refresh') ? '🔄 ' + text : text;
        badge.style.background = color;
    }
}

export function updateLedIndicator(status) {
    const led = document.getElementById('geohelper-led-indicator');
    if (!led) return;

    const colors = {
        ready: { bg: '#4ade80', shadow: '#4ade80' },
        refreshing: { bg: '#fbbf24', shadow: '#fbbf24' },
        error: { bg: '#ef4444', shadow: '#ef4444' },
        reset: { bg: '#ef4444', shadow: '#ef4444' },
        waiting: { bg: '#9ca3af', shadow: '#9ca3af' }
    };

    const c = colors[status] || colors.ready;
    led.style.background = c.bg;
    led.style.boxShadow = `0 0 6px ${c.shadow}`;
}
