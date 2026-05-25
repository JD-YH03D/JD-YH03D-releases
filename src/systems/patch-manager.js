/**
 * BintangToba - Patch Manager
 * Handles XHR interception to capture Google Maps API responses.
 */

import { Logger } from '../core/logger.js';
import { Validators } from '../common/validators.js';
import { extractionCache } from '../features/geo/cache.js';
import { telemetryInc } from '../core/telemetry.js';
import { state } from '../core/state.js';

const XHR_LISTENER_FLAG = '__btp_listened';
const XHR_PATCH_FLAG = '__btp_open_patched';
const XHR_ORIGINAL_OPEN_KEY = '__btp_original_open';

/**
 * Install XHR interceptor
 */
export function installXHRInterceptor() {
    if (XMLHttpRequest.prototype[XHR_PATCH_FLAG]) return;

    XMLHttpRequest.prototype[XHR_ORIGINAL_OPEN_KEY] = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype[XHR_PATCH_FLAG] = true;

    XMLHttpRequest.prototype.open = function (method, url) {
        const targetUrls = [
            'https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata',
            'https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/SingleImageSearch'
        ];

        if (!this[XHR_LISTENER_FLAG] &&
            method.toUpperCase() === 'POST' &&
            targetUrls.some(target => url.startsWith(target))) {

            this[XHR_LISTENER_FLAG] = true;
            this.addEventListener('load', function () {
                try {
                    const pattern = /-?\d+\.\d+,-?\d+\.\d+/g;
                    const matches = this.responseText.match(pattern);
                    if (matches && matches.length > 0) {
                        const [latStr, lngStr] = matches[0].split(',');
                        const lat = parseFloat(latStr);
                        const lng = parseFloat(lngStr);
                        if (Validators.isValidCoord(lat, lng)) {
                            state.interceptedCoords = { lat, lng };
                            extractionCache.invalidate();
                            Logger.debug('XHR intercepted:', lat.toFixed(6), lng.toFixed(6));
                        }
                    }
                } catch (e) {
                    // Silent
                }
            });
        }

        return XMLHttpRequest.prototype[XHR_ORIGINAL_OPEN_KEY].apply(this, arguments);
    };
}

/**
 * Uninstall XHR interceptor
 */
export function uninstallXHRInterceptor() {
    if (XMLHttpRequest.prototype[XHR_PATCH_FLAG] && XMLHttpRequest.prototype[XHR_ORIGINAL_OPEN_KEY]) {
        XMLHttpRequest.prototype.open = XMLHttpRequest.prototype[XHR_ORIGINAL_OPEN_KEY];
        delete XMLHttpRequest.prototype[XHR_PATCH_FLAG];
        delete XMLHttpRequest.prototype[XHR_ORIGINAL_OPEN_KEY];
    }
}

export const PatchManager = {
    _status: {
        xhrInstalled: false,
        installedByUs: false,
        lastInstallAt: 0,
        lastUninstallAt: 0,
        lastError: null
    },

    installXHRPatch() {
        telemetryInc('patch.installAttempts');
        try {
            const wasPatchedBefore = !!XMLHttpRequest.prototype[XHR_PATCH_FLAG];
            const hadOurOriginalBefore = !!XMLHttpRequest.prototype[XHR_ORIGINAL_OPEN_KEY];

            installXHRInterceptor();

            const installedNow = !!XMLHttpRequest.prototype[XHR_PATCH_FLAG];
            const hasOurOriginalNow = !!XMLHttpRequest.prototype[XHR_ORIGINAL_OPEN_KEY];

            this._status.xhrInstalled = installedNow;
            this._status.installedByUs = (wasPatchedBefore && hadOurOriginalBefore) || (!wasPatchedBefore && hasOurOriginalNow);
            this._status.lastInstallAt = Date.now();
            this._status.lastError = null;
            telemetryInc('patch.installSuccess');
            return this._status.xhrInstalled;
        } catch (e) {
            this._status.lastError = e?.message || 'install failed';
            telemetryInc('patch.installFail');
            return false;
        }
    },

    uninstallXHRPatch() {
        telemetryInc('patch.uninstallAttempts');
        try {
            const hasOurOriginal = !!XMLHttpRequest.prototype[XHR_ORIGINAL_OPEN_KEY];
            if (hasOurOriginal || this._status.installedByUs) {
                uninstallXHRInterceptor();
            }
            this._status.xhrInstalled = !!XMLHttpRequest.prototype[XHR_PATCH_FLAG];
            this._status.installedByUs = !!XMLHttpRequest.prototype[XHR_ORIGINAL_OPEN_KEY];
            this._status.lastUninstallAt = Date.now();
            telemetryInc('patch.uninstallSuccess');
            return !this._status.xhrInstalled || !hasOurOriginal;
        } catch (e) {
            this._status.lastError = e?.message || 'uninstall failed';
            telemetryInc('patch.uninstallFail');
            return false;
        }
    },

    ensureXHRPatch() {
        telemetryInc('patch.ensureChecks');
        if (XMLHttpRequest.prototype[XHR_PATCH_FLAG]) {
            this._status.xhrInstalled = true;
            this._status.installedByUs = !!XMLHttpRequest.prototype[XHR_ORIGINAL_OPEN_KEY];
            return true;
        }
        telemetryInc('patch.ensureReinstalls');
        return this.installXHRPatch();
    },

    status() {
        return {
            ...this._status,
            xhrInstalled: !!XMLHttpRequest.prototype[XHR_PATCH_FLAG]
        };
    }
};
