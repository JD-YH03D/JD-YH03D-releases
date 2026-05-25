/**
 * BintangToba - Manifest Generator
 * Manages versioning and distribution metadata.
 */

import fs from 'fs';
import { resolve } from 'path';

export function generateManifest() {
    const packageJson = JSON.parse(fs.readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'));
    const version = packageJson.version;
    const distPath = resolve(process.cwd(), 'dist');

    if (!fs.existsSync(distPath)) fs.mkdirSync(distPath);

    const manifest = {
        version: version,
        buildDate: new Date().toISOString(),
        platform: 'geoguessr',
        releaseChannel: 'stable'
    };

    fs.writeFileSync(
        resolve(distPath, 'manifest.json'),
        JSON.stringify(manifest, null, 2)
    );

    // Also write simple version.json for the loader
    fs.writeFileSync(
        resolve(distPath, 'version.json'),
        JSON.stringify({ version })
    );

    return version;
}
