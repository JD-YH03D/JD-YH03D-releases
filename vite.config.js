import { defineConfig } from 'vite';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const VERSION = '2.0.0';
const BUILD_TIMESTAMP = new Date().toISOString();

// Simple plugin to prepend Userscript header
const userscriptHeader = () => {
    return {
        name: 'userscript-header',
        renderChunk(code) {
            const header = `// ==UserScript==
// @name         BintangToba Pro [Core]
// @version      ${VERSION}
// @description  Modular GeoGuessr Utility
// @author       BT-Team
// @match        *://*.geoguessr.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @run-at       document-start
// @build-at     ${BUILD_TIMESTAMP}
// ==/UserScript==

`;
            return header + code;
        }
    };
};

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.js'),
            name: 'BintangToba',
            fileName: () => 'core.user.js',
            formats: ['iife']
        },
        minify: 'esbuild',
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                extend: true
            }
        }
    },
    plugins: [userscriptHeader()]
});
