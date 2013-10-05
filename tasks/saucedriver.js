var runner = require('./lib/sauce-runner.js');

module.exports = function(grunt) {
	grunt.registerMultiTask(
		'saucedriver',
		'Run Selenium tests on SauceLabs via NodeJS WebDriver bindings',
		function() {
			var options = this.options({
				username: process.env.SAUCE_USERNAME,
				key: process.env.SAUCE_ACCESS_KEY,
				identifier: Math.floor((new Date()).getTime() / 1000 - 1230768000).toString(),
				concurrency: 1,
				tunneled: true,
				tunnelTimeout: 120,
				testname: "",
				tags: [],
				autoclose: true,
				slow: false,
				logging: true
			});
			
			runner.run(grunt, options, this.async());
		}
	);
};