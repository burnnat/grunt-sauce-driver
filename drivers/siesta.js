/**
 * Selenium script for running Siesta unit tests.
 */
module.exports = function(browser, chain, options) {
	var button = function(title) {
		return '.x-btn a[title="' + title + '"]';
	};
	
	var runAllButton = button('Run all');
	var endCondition = '!!Siesta.my.activeHarness.endDate';
	
	chain
		.waitForElementByCss(runAllButton, options.testReadyTimeout)
		.elementByCss(runAllButton, function(err, el) {
			browser.next('clickElement', el);
			browser.next('moveTo', el);
		})
		.elementByCss('a.logo-link', function(err, el) {
			browser.next('moveTo', el);
		})
		.waitForCondition(endCondition, options.testTimeout, options.testInterval)
		.elementsByCss('.tr-testgrid .x-grid-row .test-icon.icon-bug', function(err, els) {
			// Note that browser.next() always unshifts to the start of the queue,
			// so when adding multiple operations, the calls will be executed in the
			// reverse order of what they appear here.
			
			if (els.length > 0) {
				browser.next('waitForCondition', endCondition, options.testTimeout, options.testInterval);
				
				browser.next('elementByCss', button('Run failed'), function(err, el) {
					browser.next('clickElement', el);
				});
				
				els.forEach(function(el) {
					browser.next('clickElement', el);
					browser.next('moveTo', el);
				});
				
				browser.next('execute', 'Siesta.my.activeHarness.endDate = null');
			}
		})
		.safeEval("Siesta.REPORTER ? Siesta.my.activeHarness.generateReport() : null", function(err, obj) {
			if (obj) {
				browser.saucePassed = obj.passed;
				browser.sauceData = { siesta: obj };
			}
		});
};