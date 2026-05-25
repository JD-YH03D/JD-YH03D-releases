/**
 * BintangToba - Security Utilities
 * Handles XSS prevention and input validation.
 */

export const Security = {
    /**
     * Escape HTML to prevent XSS
     * @param {string} text
     * @returns {string}
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    },

    /**
     * Escape attribute value
     * @param {string} text
     * @returns {string}
     */
    escapeAttr(text) {
        return this.escapeHtml(text).replace(/"/g, '&quot;');
    },

    /**
     * Encode URI component safely
     * @param {string|number} value
     * @returns {string}
     */
    encodeParam(value) {
        return encodeURIComponent(String(value));
    },

    /**
     * Validate Discord webhook URL
     * @param {string} url
     * @returns {boolean}
     */
    isValidDiscordWebhook(url) {
        if (!url || typeof url !== 'string') return false;
        try {
            const parsed = new URL(url);
            return parsed.protocol === 'https:' &&
                parsed.hostname === 'discord.com' &&
                parsed.pathname.includes('/api/webhooks/');
        } catch (e) {
            return false;
        }
    }
};
