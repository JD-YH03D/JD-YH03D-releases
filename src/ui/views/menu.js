/**
 * BintangToba - Menu View
 * Template for the app drawer with navigation icons.
 */

export function createMenuView() {
    const view = document.createElement('div');
    view.id = 'geohelper-menu-view';
    view.style.cssText = `min-width: 100%; display: flex; flex-direction: column; background: linear-gradient(180deg, #667eea 0%, #764ba2 100%); padding: 16px 12px;`;

    const appIcons = [
        { id: 'geohelper-maps-btn', icon: '🗺️', label: 'Maps' },
        { id: 'geohelper-copy-btn', icon: '📋', label: 'Copy' },
        { id: 'geohelper-action-mark', icon: '📍', label: 'Mark' },
        { id: 'geohelper-action-safe', icon: '🎲', label: 'Safe' },
        { id: 'geohelper-action-refresh', icon: '🔄', label: 'Refresh' },
        { id: 'geohelper-app-history', icon: '📜', label: 'History' },
        { id: 'geohelper-app-hotkeys', icon: '⌨️', label: 'Hotkeys' },
        { id: 'geohelper-app-discord', icon: '💬', label: 'Discord' },
        { id: 'geohelper-app-settings', icon: '⚙️', label: 'Settings' }
    ];

    const grid = document.createElement('div');
    grid.style.cssText = `display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px 10px; flex: 1; align-content: start;`;

    appIcons.forEach(app => {
        const btn = document.createElement('div');
        btn.id = app.id;
        btn.className = 'geohelper-app-btn';
        btn.style.cssText = `display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; transition: transform 0.15s;`;
        btn.innerHTML = `
            <div class="geohelper-app-icon" style="width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:25px;background:rgba(255,255,255,0.2);color:#fff;">
                ${app.icon}
            </div>
            <span class="geohelper-app-label" style="font-size:10px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.3);">${app.label}</span>
        `;
        grid.appendChild(btn);
    });

    view.appendChild(grid);
    return view;
}
