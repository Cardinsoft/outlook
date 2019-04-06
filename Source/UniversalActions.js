function universalHome(e) {
	return new Promise(
		function(resolve) {
			cardOpen(e);
		}
	);
};
function universalSettings(e) {
	return new Promise(
		function(resolve) {
			cardSettings(e);
		}
	);
};
function universalHelp(e) {
	return new Promise(
		function(resolve) {
			cardHelp(e);
		}
	);
};