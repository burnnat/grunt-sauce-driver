/**
 * Selenium script for running Siesta unit tests.
 */
module.exports = function(browser, chain, options) {
	var runButton = '.x-btn a[title="Run all"]';
	
	chain
		.waitForElementByCss(runButton, options.testReadyTimeout)
		.elementByCss(runButton, function(err, el) {
			browser.next('moveTo', el);
			browser.next('clickElement', el);
		})
		.elementByCss('a.logo-link', function(err, el) {
			browser.next('moveTo', el);
		})
		.waitForCondition('!!Siesta.my.activeHarness.endDate', options.testTimeout, options.testInterval)
		.safeEval("Siesta.REPORTER ? Siesta.my.activeHarness.generateReport() : null", function(err, obj) {
			if (obj) {
				browser.saucePassed = obj.passed;
				browser.sauceData = { siesta: obj };
			}
		});
};