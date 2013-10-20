var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

var os = {
	win32: /^(windows|vista|xp)/i,
	linux: /^linux/i,
	darwin: /^(mac|os x)/i
};

var platformTest = os[process.platform];

module.exports = {
	drivers: {
		'chrome': 'chromedriver',
		'internet explorer': 'IEDriverServer'
	},
	
	hasBrowser: function(browser) {
		return platformTest.test(browser.platform) && this.commandOnPath(this.drivers[browser.browserName]);
	},
	
	commandOnPath: function(command) {
		if (!command) {
			return false;
		}
		
		var delimiter = path.delimiter
		
		var extensions = process.env.PATHEXT
			? process.env.PATHEXT.split(delimiter)
			: [''];
		
		return (
			process.env.PATH.split(delimiter)
				.some(function(envpath) {
					return extensions.some(function(extension) {
						return fs.existsSync(
							path.join(envpath, command + extension)
						);
					});
				})
		);
	},
	
	startDriver: function(browser, port) {
		return spawn(
			this.drivers[browser.browserName],
			['--port=' + port]
		);
	},
	
	stopDriver: function(driver) {
		driver.kill();
	}
};