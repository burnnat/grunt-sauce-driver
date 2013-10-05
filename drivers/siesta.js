/**
 * Selenium script for running Siesta unit tests.
 */
var testReadyTimeout = 10000;
var testRunTimeout = 180000;
var testCompletePoll = 1000;

module.exports = function(browser, chain) {
	var runButton = '.x-btn a[title="Run all"]';
	
	chain
		.waitForElementByCss(runButton, testReadyTimeout)
		.elementByCss(runButton, function(err, el) {
			browser.next('moveTo', el);
			browser.next('clickElement', el);
		})
		.elementByCss('a.logo-link', function(err, el) {
			browser.next('moveTo', el);
		})
		.waitForCondition('!!Siesta.my.activeHarness.endDate', testRunTimeout, testCompletePoll)
		.safeEval("Siesta.REPORTER ? Siesta.my.activeHarness.generateReport() : null", function(err, obj) {
			if (obj) {
				browser.saucePassed = obj.passed;
				browser.sauceData = { siesta: obj };
			}
		});
};