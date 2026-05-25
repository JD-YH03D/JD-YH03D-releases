/**
 * BintangToba - Constants & Configuration
 * Centralized immutable configuration object.
 */

export const INIT_GUARD_KEY = '__btp_initialized';
export const CLEANUP_GUARD_KEY = '__btp_cleaned';

export const CONFIG = Object.freeze({
    // App Info
    NAME: 'Bintang Toba Pro',
    VERSION: '2.1.0',
    DEBUG: false,

    // External Services
    NOMINATIM_URL: 'https://nominatim.openstreetmap.org/reverse',
    LEAFLET_CSS: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    LEAFLET_JS: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    VERSION_METADATA_URL: 'https://api.npoint.io/1e372530fb1113d8afc6',

    // Storage Keys
    STORAGE_KEYS: Object.freeze({
        DISCORD_WEBHOOK: 'bintang_toba_discord_webhook',
        HOTKEYS: 'bintang_toba_hotkeys',
        PRESET: 'bintang_toba_preset',
        MAP_LAYER: 'bintang_toba_map_layer',
        THEME: 'bintang_toba_theme_mode',
        UI_SCALE: 'bintang_toba_ui_scale',
        FEATURES: 'bintang_toba_features',
        DEBUG: 'bintang_toba_debug',
        INTEGRITY_CACHE: 'bintang_toba_integrity_cache',
        PROTECTION_STATE: 'bintang_toba_protection_state',
        REMOTE_VERSION_CACHE: 'bintang_toba_remote_version_cache'
    }),

    // Timing Configuration
    TIMING: Object.freeze({
        MONITORING_INTERVAL: 500,
        EXTRACT_LOG_INTERVAL: 5000,
        ADDRESS_RATE_LIMIT_GEOGUESSR: 1000,
        ADDRESS_RATE_LIMIT_DEFAULT: 1500,
        EXTRACTION_CACHE_TTL: 400,
        HOTKEY_CACHE_TTL: 10000,
        KEYDOWN_DEBOUNCE: 50,
        LEAFLET_LOAD_TIMEOUT: 10000,
        LEAFLET_POLL_INTERVAL: 50,
        MAP_FIND_DELAY: 2000,
        BUTTON_FEEDBACK_DURATION: 1500,
        CLOCK_UPDATE_INTERVAL: 60000,
        INTEGRITY_CHECK_INTERVAL: 180000,
        INTEGRITY_HEARTBEAT_INTERVAL: 45000,
        INTEGRITY_FETCH_TIMEOUT: 10000,
        INTEGRITY_CACHE_TTL: 300000,
        INTEGRITY_MIN_FETCH_GAP: 30000
    }),

    // Cooldowns
    COOLDOWNS: Object.freeze({
        TOGGLE_PANEL: 150,
        MARKER: 200,
        REFRESH: 500,
        INFO: 200,
        COPY: 350,
        MAPS: 600,
        AUTO_PLACE: 250,
        SAFE_PLACE: 250,
        ZOOM: 100,
        DISCORD: 700,
        DISCORD_SEND: 1500,
        HISTORY_COPY: 400,
        HISTORY_EXPORT: 700,
        SESSION_BACKUP: 700
    }),

    // Map Configuration
    MAP: Object.freeze({
        DEFAULT_ZOOM: 13,
        WORLD_VIEW_ZOOM: 2,
        MIN_ZOOM: 1,
        PAN_THRESHOLD: 0.0001,
        JUMP_THRESHOLD: 1.0,
        NEW_ROUND_THRESHOLD: 0.1,
        SAFE_MODE_OFFSET_DEGREES: 0.00045 // ~50 meters
    }),

    // Limits
    LIMITS: Object.freeze({
        HISTORY_MAX_ITEMS: 10,
        ADDRESS_QUEUE_MAX: 5,
        FIBER_WALK_MAX_DEPTH: 15
    }),

    // Default Hotkeys
    DEFAULT_HOTKEYS: Object.freeze({
        panel: 'Home',
        marker: 'M',
        info: 'V',
        refresh: 'X',
        zoomIn: 'S',
        zoomOut: 'A',
        copyCoords: 'C',
        googleMaps: 'G',
        discord: 'D',
        autoPlace: '1',
        safePlace: '2'
    }),

    // Feature Flags
    DEFAULT_FEATURES: Object.freeze({
        autoMarker: false,
        safeMode: false
    }),

    // Presets
    PRESETS: Object.freeze({
        exact: Object.freeze({ autoMarker: false, safeMode: false }),
        safe: Object.freeze({ autoMarker: false, safeMode: true }),
        stealth: Object.freeze({ autoMarker: true, safeMode: true })
    }),

    // Appearance
    THEMES: Object.freeze({
        dark: { name: 'Dark', alias: 'oneui' },
        colorful: { name: 'Colorful', alias: 'classic' }
    }),

    UI_SCALES: Object.freeze({
        normal: { name: 'Normal', factor: 1 },
        compact: { name: 'Compact', factor: 0.92 }
    }),

    MAP_LAYERS: Object.freeze({
        default: Object.freeze({
            name: 'Default',
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            options: { maxZoom: 19 }
        }),
        dark: Object.freeze({
            name: 'Dark',
            url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            options: { maxZoom: 19, subdomains: 'abcd' }
        }),
        terrain: Object.freeze({
            name: 'Terrain',
            url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            options: { maxZoom: 17 }
        })
    }),

    DEFAULTS: Object.freeze({
        MAP_LAYER: 'default',
        THEME: 'colorful',
        UI_SCALE: 'normal',
        PRESET: 'exact'
    }),

    FLAGS: Object.freeze({
        USE_PATCH_MANAGER: false,
        USE_EXTRACTOR_REGISTRY: false,
        USE_REQUEST_TOKENING: false,
        USE_DEGRADED_MODE: false,
        ENABLE_SHADOW_EXTRACTION_TELEMETRY: true
    })
});
