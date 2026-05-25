/**
 * BintangToba - Extractor Registry
 * Manages multiple extraction strategies and shadow telemetry.
 */

import { state } from '../../core/state.js';
import { Validators } from '../../common/validators.js';
import { telemetryInc, telemetryTime } from '../../core/telemetry.js';
import { extractFromIframes, extractFromGoogleSV } from './extractor.js';

export const ExtractorRegistry = {
    _initialized: false,
    _strategies: [],
    _health: Object.create(null),

    register(name, runFn) {
        this._strategies.push({ name, run: runFn });
        if (!this._health[name]) {
            this._health[name] = {
                attempts: 0,
                success: 0,
                nulls: 0,
                mismatches: 0,
                totalMs: 0,
                avgMs: 0,
                lastMs: 0,
                lastOkAt: 0,
                lastNullAt: 0
            };
        }
    },

    initDefaults() {
        if (this._initialized) return;
        this._initialized = true;

        this.register('shadow_xhr_intercept', () => state.interceptedCoords);
        this.register('shadow_iframe', () => extractFromIframes());
        this.register('shadow_google_sv', () => extractFromGoogleSV());

        this.register('shadow_url_params', () => {
            const params = new URLSearchParams(window.location.search);
            const lat = parseFloat(params.get('lat'));
            const lng = parseFloat(params.get('lng') || params.get('lon'));
            return Validators.isValidCoord(lat, lng) ? { lat, lng } : null;
        });
    },

    runShadowAgainst(liveResult) {
        if (!state.runtime?.flags?.ENABLE_SHADOW_EXTRACTION_TELEMETRY) return;
        this.initDefaults();

        telemetryInc('extraction.shadowRuns');

        // Shadow runs execute asynchronously
        setTimeout(() => {
            for (const strategy of this._strategies) {
                const started = performance.now();
                let result = null;
                try {
                    result = strategy.run();
                } catch (e) { result = null; }
                const ms = performance.now() - started;
                const ok = !!(result && Validators.isValidCoord(result.lat, result.lng));

                telemetryTime(strategy.name, ms, ok);
                const h = this._health[strategy.name];
                h.attempts++;
                h.lastMs = ms;
                h.totalMs += ms;
                h.avgMs = h.attempts ? +(h.totalMs / h.attempts).toFixed(3) : 0;

                if (ok) {
                    h.success++;
                    h.lastOkAt = Date.now();
                } else {
                    h.nulls++;
                    h.lastNullAt = Date.now();
                }

                if (!Validators.areCoordsEquivalent(liveResult, result)) {
                    h.mismatches++;
                    telemetryInc('extraction.shadowMismatches');
                }
            }
        }, 0);
    }
};
