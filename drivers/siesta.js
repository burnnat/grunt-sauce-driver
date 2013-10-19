/**
 * Selenium script for running Siesta unit tests.
 */
module.exports = function(browser, options) {
	var button = function(title) {
		return '.x-btn a[title="' + title + '"]';
	};
	
	var runAllButton = button('Run all');
	var endCondition = "!!Siesta.my.activeHarness.endDate";
	
	return (
		browser
		.waitForElementByCss(
			runAllButton,
			options.testReadyTimeout
		)
		.elementByCss(runAllButton)
		.click()
		.waitForCondition(
			endCondition,
			options.testTimeout,
			options.testInterval
		)
		.elementsByCss('.tr-testgrid .x-grid-row .test-icon.icon-bug')
		.then(
			function(els) {
				if (els.length > 0) {
					var next = browser.execute("Siesta.my.activeHarness.endDate = null");
					
					els.forEach(function(el) {
						next = next.clickElement(el).moveTo();
					});
					
					return (
						next
						.elementByCss(button('Run failed'))
						.click()
						.waitForCondition(
							endCondition,
							options.testTimeout,
							options.testInterval
						)
					);
				}
			}
		)
		.safeEval("Siesta.REPORTER ? Siesta.my.activeHarness.generateReport() : null")
		.then(function(obj) {
			browser.saucePassed = obj.passed;
			browser.sauceData = { siesta: obj };
		})
	);
};