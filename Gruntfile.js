var saucedriver = require('./drivers.js');

module.exports = function(grunt) {
	grunt.initConfig({
		connect: {
			server: {
				options: {
					base: 'test',
					port: 9999
				}
			}
		},
		
		saucedriver: {
			options: {
				browsers: [
					{
						browserName: 'chrome',
						platform: 'Windows 7'
					}
				]
			},
			
			jasmine: {
				options: {
					url: 'http://localhost:9999/jasmine/examples/spec-runner/spec-runner.html',
					script: saucedriver.jasmine,
					local: true
				}
			}
		}
	});
	
	grunt.loadTasks('tasks');
	
	// Loading dependencies
	for (var key in grunt.file.readJSON("package.json").devDependencies) {
		if (key !== "grunt" && key !== "grunt-cli" && key.indexOf("grunt") === 0) {
			grunt.loadNpmTasks(key);
		}
	}
	
	grunt.registerTask("test", ["connect", "saucedriver"]);
};
