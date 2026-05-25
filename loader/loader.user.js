// ==UserScript==
// @name         BintangToba Loader
// @namespace    BT-Pro
// @version      0.1.0
// @description  Safe bootstrapper for BintangToba Core
// @match        *://*.geoguessr.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

(async function () {
    'use strict';

    const CONFIG = {
        PRIMARY_URL: 'https://raw.githubusercontent.com/JD-YH03D/JD-YH03D-releases/main/dist/core.user.js',
        FALLBACK_URL: 'https://cdn.jsdelivr.net/gh/JD-YH03D/JD-YH03D-releases@main/dist/core.user.js',
        VERSION_URL: 'https://raw.githubusercontent.com/JD-YH03D/JD-YH03D-releases/main/dist/version.json',
        TIMEOUT: 8000
    };

    async function fetchBundle(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${url}?t=${Date.now()}`,
                timeout: CONFIG.TIMEOUT,
                onload: (res) => (res.status === 200) ? resolve(res.responseText) : reject(),
                onerror: reject,
                ontimeout: reject
            });
        });
    }

    async function bootstrap() {
        console.log('[BT-Loader] Initializing...');
        let bundleCode = null;

        try {
            bundleCode = await fetchBundle(CONFIG.PRIMARY_URL);
            GM_setValue('bt_cached_bundle', bundleCode);
            console.log('[BT-Loader] Primary bundle loaded');
        } catch (e) {
            console.warn('[BT-Loader] Primary failed, trying fallback...');
            try {
                bundleCode = await fetchBundle(CONFIG.FALLBACK_URL);
                GM_setValue('bt_cached_bundle', bundleCode);
            } catch (e2) {
                console.error('[BT-Loader] Network failure, using local cache');
                bundleCode = GM_getValue('bt_cached_bundle');
            }
        }

        if (bundleCode) {
            try {
                const script = document.createElement('script');
                script.textContent = bundleCode;
                (document.head || document.documentElement).appendChild(script);
                console.log('[BT-Loader] Core executed');
            } catch (e) {
                console.error('[BT-Loader] Execution failed');
            }
        } else {
            console.error('[BT-Loader] Critical error: No bundle available');
        }
    }

    bootstrap();
})();
