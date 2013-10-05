/**
 * Selenium script for running Jasmine unit tests.
 */
var testReadyTimeout = 10000;
var testRunTimeout = 180000;
var testCompletePoll = 1000;

module.exports = function(browser, chain) {
	chain
		.waitForElementByClassName('alert', testReadyTimeout)
		.waitForCondition('!!jasmine.runnerResults', testRunTimeout, testCompletePoll)
		.safeEval("jasmine.getJSReport ? jasmine.getJSReport() : null", function(err, obj) {
			if (obj) {
				browser.saucePassed = obj.passed;
				browser.sauceData = { jasmine: obj };
			}
		});
};