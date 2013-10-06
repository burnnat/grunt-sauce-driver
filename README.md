grunt-sauce-driver
==================

A [Grunt](http://gruntjs.com/) task for running [WebDriver scripts](https://github.com/admc/wd) in the [Sauce Labs](https://saucelabs.com/) cloud.

In addition to supporting custom scripts, standard scripts are provided for running javascript unit tests in [Jasmine](http://pivotal.github.io/jasmine/) and [Siesta Lite](http://www.bryntum.com/products/siesta/).

Inspired by the [grunt-saucelabs](https://github.com/axemclion/grunt-saucelabs) plugin, this project aims to provide greater flexibility and support for custom WebDriver scripts.

Usage
-----

```javascript
var saucedriver = require('grunt-sauce-driver');

grunt.initConfig({
	saucedriver: {
		options: {
			username: 'saucelabs-user-name',
			key: 'saucelabs-key',
			tunneled: true,
			tags: ['example', 'sample'],
			browsers: [{
				browserName: 'opera'
			}]
		},
		
		jasmine: {
			url: 'http://example.com/test/jasmine.html',
			script: saucedriver.jasmine
		},
		
		siesta: {
			url: 'http://example.com/test/siesta.html',
			script: saucedriver.siesta
		},
		
		custom: {
			url: 'http://example.com/test/siesta.html',
			script: function(browser, chain) {
				chain
					.waitForElementByClassName('some-class')
					.elementByXPath(
						'//input[type=button]',
						function(err, el) {
							browser.next('clickElement', el);
						}
					)
					.log('Test complete');
			}
		}
	}
});
```

Supported options are:

* __username__ : The Sauce Labs username that will be used to connect to the servers. _Required_
* __key__ : The Sauce Labs secret key. Since this is a secret, this should not be checked into the source code and may be available as an environment variable. Grunt can access this using   `process.env.saucekey`. _Required_
* __url__: The URL to load in the Sauce Labs browser. _Required_
* __tunneled__: Defaults to true; Won't launch a Sauce Connect tunnel if set to false. _Optional_
* __tags__: An array of tags displayed for this test on the Sauce Labs dashboard. _Optional_
* __browsers__: An array of objects representing the [various browsers](https://saucelabs.com/docs/platforms) on which this test should run.  _Optional_
* __testTimeout__ : Number of milliseconds to wait for qunit tests on each page before timeout and failing the test (default: 180000). _Optional_
* __testInterval__ : Number of milliseconds between each retry to see if a test is completed or not (default: 1000). _Optional_
* __testReadyTimeout__: Number of milliseconds to wait until the test-page is ready to be read (default: 10000). _Optional_

License
-------

This project is published under the terms of the [MIT License](http://opensource.org/licenses/MIT).

Copyright &copy; 2013 by [Nat Burns](https://github.com/burnnat).