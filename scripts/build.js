/**
 * BintangToba - Build Orchestrator
 * Coordinates bundling, hashing, and versioning.
 */

import { execSync } from 'child_process';
import { resolve } from 'path';
import fs from 'fs';
import { generateManifest } from './manifest.js';
import { generateHashes } from './hash.js';

async function build() {
    console.log('🚀 Starting BintangToba Production Build...');

    try {
        // 1. Core Bundle
        console.log('📦 Bundling core modules...');
        execSync('npx vite build', { stdio: 'inherit' });

        // 2. Generate Metadata
        console.log('📝 Generating version manifest...');
        const version = generateManifest();

        // 3. Generate Integrity Hashes
        console.log('🛡️ Generating integrity baseline...');
        await generateHashes();

        console.log(`\n✅ Build successful: v${version}`);
        console.log('📂 Location: ./dist/');
    } catch (e) {
        console.error('❌ Build failed:', e.message);
        process.exit(1);
    }
}

build();
