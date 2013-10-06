/**
 * Selenium script for running Jasmine unit tests.
 */
module.exports = function(browser, chain, options) {
	chain
		.waitForElementByClassName('jasmine_reporter', options.testReadyTimeout)
		.waitForCondition('!!jasmine.runnerResults', options.testTimeout, options.testInterval)
		.safeEval("jasmine.getJSReport ? jasmine.getJSReport() : null", function(err, obj) {
			if (obj) {
				browser.saucePassed = obj.passed;
				browser.sauceData = { jasmine: obj };
			}
		});
};