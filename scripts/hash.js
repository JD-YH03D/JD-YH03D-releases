/**
 * BintangToba - Hash Generator
 * Generates SHA-256 baseline for bundled artifacts.
 */

import fs from 'fs';
import crypto from 'crypto';
import { resolve } from 'path';

export async function generateHashes() {
    const distPath = resolve(process.cwd(), 'dist');
    const bundlePath = resolve(distPath, 'core.user.js');

    if (!fs.existsSync(bundlePath)) {
        throw new Error('Bundle not found at ' + bundlePath);
    }

    const content = fs.readFileSync(bundlePath, 'utf8');
    const hash = crypto.createHash('sha256').update(content).digest('hex');

    const manifest = {
        updatedAt: new Date().toISOString(),
        artifacts: {
            'core.user.js': {
                hash: hash,
                algorithm: 'sha256'
            }
        }
    };

    fs.writeFileSync(
        resolve(distPath, 'hashes.json'),
        JSON.stringify(manifest, null, 2)
    );

    console.log(`   SHA-256: ${hash.substring(0, 16)}...`);
}
