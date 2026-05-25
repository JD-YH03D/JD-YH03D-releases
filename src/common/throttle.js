/**
 * BintangToba - Throttle Utility
 * Rate limiting for frequent actions.
 */

const actionCooldowns = Object.create(null);

export const Throttle = {
    /**
     * Check if action can run (not in cooldown)
     * @param {string} actionKey
     * @param {number} cooldownMs
     * @returns {boolean}
     */
    canRun(actionKey, cooldownMs = 250) {
        const now = Date.now();
        const last = actionCooldowns[actionKey] || 0;
        if ((now - last) < cooldownMs) return false;
        actionCooldowns[actionKey] = now;
        return true;
    },

    /**
     * Create throttled event handler
     * @param {string} actionKey
     * @param {number} cooldownMs
     * @param {Function} handler
     * @returns {Function}
     */
    createHandler(actionKey, cooldownMs, handler) {
        return function (e) {
            if (!Throttle.canRun(actionKey, cooldownMs)) return;
            if (e && e.preventDefault) e.preventDefault();
            handler.call(this, e);
        };
    },

    /**
     * Reset all cooldowns
     */
    resetAll() {
        Object.keys(actionCooldowns).forEach(k => delete actionCooldowns[k]);
    }
};
