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
						browserName: 'safari',
						platform: 'OS X 10.8'
					},
					{
						browserName: 'opera',
						platform: 'Linux'
					},
					{
						browserName: 'chrome',
						platform: 'Windows 7'
					},
					{
						browserName: 'firefox',
						version: '25',
						platform: 'Windows 7'
					},
					{
						browserName: 'internet explorer',
						platform: 'Windows 8',
						version: '10'
					},
					{
						browserName: 'internet explorer',
						platform: 'Windows 7',
						version: '9'
					},
					{
						browserName: 'internet explorer',
						platform: 'Windows XP',
						version: '8'
					}
				],
				
				build: process.env.TRAVIS_JOB_ID,
				local: grunt.option('local'),
				concurrency: 3
			},
			
			jasmine: {
				options: {
					url: 'http://localhost:9999/jasmine/examples/spec-runner/spec-runner.html',
					script: saucedriver.jasmine,
					testname: 'jasmine tests'
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
