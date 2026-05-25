/**
 * BintangToba - Discord Integration
 * Handles sending location data to Discord webhooks.
 */

import { Logger } from '../../core/logger.js';
import { CONFIG } from '../../core/constants.js';
import { state } from '../../core/state.js';
import { Throttle } from '../../common/throttle.js';
import { Security } from '../../common/security.js';
import { Validators } from '../../common/validators.js';
import { extractCoordinates } from '../../features/geo/extractor.js';
import { formatAddress } from '../../features/address/lookup.js';

let discordInFlight = false;

export async function sendToDiscord() {
    if (discordInFlight) return;
    if (!Throttle.canRun('discord_send', CONFIG.COOLDOWNS.DISCORD_SEND)) return;

    const webhook = state.settings?.discordWebhook;
    if (!webhook || !Security.isValidDiscordWebhook(webhook)) {
        alert('Invalid Discord webhook URL');
        return;
    }

    const coords = extractCoordinates();
    if (!coords || !Validators.isValidCoord(coords.lat, coords.lng)) return;

    const embed = {
        title: '📍 Location Tracked',
        description: `**${Security.escapeHtml(formatAddress(state.address) || 'Unknown')}**`,
        color: 516235,
        fields: [
            { name: 'Coordinates', value: `\`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}\``, inline: true },
            { name: 'Platform', value: state.platform, inline: true }
        ],
        footer: { text: `${CONFIG.NAME}` },
        timestamp: new Date().toISOString()
    };

    discordInFlight = true;
    try {
        await fetch(webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
        });
        Logger.info('Discord message sent');
    } catch (e) {
        Logger.error('Discord error:', e);
    } finally {
        discordInFlight = false;
    }
}
