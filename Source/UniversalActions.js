/* 
 * Attempts to clear any pre-cached data from the widget
 * @param {Object} e event object;
 */
async function universalHome(e) {
	await cardOpen(e);
};

/**
 * Opens settings card as corresponding universal action callback;
 * @param {Object} e event object;
 */
async function universalSettings(e) {
	await cardSettings(e);
};

/**
 * Opens advanced settings card as corresponding universal action callback;
 * @param {Object} e event object;
 */
async function universalAdvanced(e) {
	await cardAdvanced(e); 
}

/**
 * Opens help card as corresponding universal action callback;
 * @param {Object} e event object;
 */
async function universalHelp(e) {
	await cardHelp(e);
};