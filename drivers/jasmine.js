/**
 * Selenium script for running Jasmine unit tests.
 */
module.exports = function(browser, options) {
	return (
		browser
		.waitForElementByClassName(
			'jasmine_reporter',
			options.testReadyTimeout
		)
		.waitForCondition(
			"!!jasmine.runnerResults",
			options.testTimeout,
			options.testInterval
		)
		.safeEval(
			"jasmine.getJSReport ? jasmine.getJSReport() : null"
		)
		.then(function(obj) {
			browser.saucePassed = obj.passed;
			browser.sauceData = { jasmine: obj };
		})
	);
};