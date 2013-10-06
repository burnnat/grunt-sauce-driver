var runner = require('./lib/sauce-runner.js');

module.exports = function(grunt) {
	grunt.registerMultiTask(
		'saucedriver',
		'Run Selenium tests on SauceLabs via NodeJS WebDriver bindings',
		function() {
			var options = this.options({
				// Required options
				url: null,
				script: null,
				browsers: [],
				
				// Selenium options
				concurrency: 1,
				
				slow: false,
				logging: true,
				
				testTimeout: 180000,
				testInterval: 2000,
				testReadyTimeout: 10000,
				
				// SauceLabs options
				username: process.env.SAUCE_USERNAME,
				key: process.env.SAUCE_ACCESS_KEY,
				identifier: Math.floor((new Date()).getTime() / 1000 - 1230768000).toString(),
				tunneled: true,
				tunnelTimeout: 120,
				
				testname: "",
				tags: [],
				build: null,
				
				// Local options
				local: false,
				autoclose: true,
				driverPort: 9515
			});
			
			if (!options.url) {
				grunt.log.error('No test URL specified.');
				return false;
			}
			
			if (!options.script) {
				grunt.log.error('No Selenium script specified.');
				return false;
			}
			
			if (!options.browsers || options.browsers.length < 1) {
				grunt.log.error('No target browsers specified.');
				return false;
			}
			
			runner.run(grunt, options, this.async());
		}
	);
};