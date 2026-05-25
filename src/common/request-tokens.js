/**
 * BintangToba - Request Tokens
 * Scope-based request tokens for stale async commit guards.
 */

export const RequestTokens = {
    _seq: 0,
    _latestByScope: Object.create(null),

    /**
     * Issue a token for a specific scope.
     * @param {string} scope
     * @returns {number}
     */
    issue(scope) {
        const key = String(scope || 'default');
        const id = ++this._seq;
        this._latestByScope[key] = id;
        return id;
    },

    /**
     * Check if token is current for scope.
     * @param {string} scope
     * @param {number} id
     * @returns {boolean}
     */
    isCurrent(scope, id) {
        const key = String(scope || 'default');
        return this._latestByScope[key] === id;
    },

    /**
     * Reset all token scopes.
     */
    resetAll() {
        this._seq = 0;
        this._latestByScope = Object.create(null);
    }
};
