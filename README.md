grunt-sauce-driver
==================

[![Build Status](https://travis-ci.org/burnnat/grunt-sauce-driver.png)](https://travis-ci.org/burnnat/grunt-sauce-driver) [![Dependency Status](https://gemnasium.com/burnnat/grunt-sauce-driver.png)](https://gemnasium.com/burnnat/grunt-sauce-driver) [![NPM version](https://badge.fury.io/js/grunt-sauce-driver.png)](http://badge.fury.io/js/grunt-sauce-driver)

[![Test Status](https://saucelabs.com/browser-matrix/grunt-sauce-driver.svg)](https://saucelabs.com/u/grunt-sauce-driver)

A [Grunt](http://gruntjs.com/) task for running [WebDriver scripts](https://github.com/admc/wd) in the [Sauce Labs](https://saucelabs.com/) cloud.

In addition to supporting custom scripts, standard scripts are provided for running javascript unit tests in [Jasmine](http://pivotal.github.io/jasmine/) and [Siesta Lite](http://www.bryntum.com/products/siesta/).

Inspired by the [grunt-saucelabs](https://github.com/axemclion/grunt-saucelabs) plugin, this project aims to provide greater flexibility and support for custom WebDriver scripts, as well as the option to run tests locally.

Local Tests
-----------

Local tests are currently supported for Google Chrome and Internet Explorer. To run tests locally, ensure you have downloaded the appropriate [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/home) or [InternetExplorerDriver](http://code.google.com/p/selenium/wiki/InternetExplorerDriver) server for your platform and made it available on your `PATH` environment variable.

Usage
-----

### Example ###

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
			url: 'http://example.com/test/custom.html',
			script: function(browser, options) {
				return (
					browser
					.waitForElementByClassName('some-class')
					.elementByXPath('//input[type=button]')
					.then(function(el) {
						return browser.moveTo(el);
					})
					.click()
					.log('Test complete')
				);
			}
		}
	}
});
```

### Options ###

#### Basic Options ####

* __url__ : String _Required_

  The URL of the page to be tested.

* __script__ : Function _Required_

  The WebDriver script to run, either a custom function or one provided by `grunt-sauce-driver`.
  The function should accept the following parameters:

  * __browser__: The WebDriver [browser](https://github.com/admc/wd#browser-initialization) object (using the [promises](https://github.com/admc/wd#q-promises--chaining) API).
  * __options__: The Grunt options object.

* __browsers__ : Object[] _Required_

  An array of objects representing the [browsers](https://saucelabs.com/docs/platforms) on which this test should run.

* __concurrency__ : Number _Optional_

  Number of concurrent browsers to test against. When running on Sauce Labs, check your account info for your maximum allowed concurrency. Defaults to `1`.

* __slow__ : Boolean/Number _Optional_

  Adds a delay between each WebDriver action, to make tests easier to watch and debug. Can be specified either as a boolean flag, or a number of milliseconds to delay. If set to `true`, a default value of 500 milliseconds will be used. Defaults to `false`.

* __logging__ : Boolean _Optional_

  If enabled, logs information about the running script to the console. Defaults to `true`.

* __testTimeout__ : Number _Optional_

  Number of milliseconds to wait for javascript tests to complete on each page before timeout and failing the test. Default to `180000`.

* __testInterval__ : Number _Optional_

  Number of milliseconds between each poll to see if a javascript test is complete. Defaults to `2000`.

* __testReadyTimeout__ : Number _Optional_

  Number of milliseconds to wait for the test page to load. Defaults to `10000`.

* __mirrorTestFailure__ : Boolean _Optional_

  When enabled, the grunt task will fail whenever any of the javascript tests fail. Otherwise, the task will fail only on WebDriver error (page load failure, test timeout, etc). Defaults to `true`.

* __ignoreFailure__ : Boolean _Optional_

  If enabled, specifies that the grunt task should always pass regardless of WebDriver errors or javascript test failures. (The task may still fail under certain catastrophic errors, however.) Defaults to `false`.

#### SauceLabs Options ####

* __username__ : String _Optional_

  The username that will be used to connect to Sauce Labs. Defaults to `process.env.SAUCE_USERNAME`.

* __key__ : String _Optional_

  The access key to provide when connecting Sauce Labs. For security purposes, don't hard-code this value in your Gruntfile. Instead, load it via local config file or environment variable. Defaults to `process.env.SAUCE_ACCESS_KEY`.

* __tunneled__ : Boolean _Optional_

  If enabled, uses a [Sauce Connect](https://saucelabs.com/docs/connect) tunnel when running tests on Sauce Labs. Defaults to `true`.

* __tunnelTimeout__ : Number _Optional_

  The connection timeout to use when initializing Sauce Connect, in seconds. Defaults to `120`.

* __testname__ : String _Optional_

  The name of the test, to be displayed on the Sauce Labs dashboard. Defaults to `""`.

* __tags__ : String[] _Optional_

  An array of tags for this test, used when filtering the Sauce Labs dashboard. Defaults to `[]`.

* __build__ : String _Optional_

  The build identifier to be associated with this test. Defaults to `null`.

#### Local Options ####

* __local__ : Boolean _Optional_

  If enabled, will run the current test on the local machine rather than Sauce Labs. Defaults to `false`.

* __autoclose__ : Boolean _Optional_

  When running local tests, determines whether the browser under test will be automatically closed after the test completes. Defaults to `true`.

* __driverPorts__ : Object _Optional_

  A map of browser names to port numbers, for use when communicating with the local WebDriver server. Defaults to `{ "chrome": 9515, "internet explorer": 5555 }`.

License
-------

This project is published under the terms of the [MIT License](http://opensource.org/licenses/MIT).

Copyright &copy; 2013 by [Nat Burns](https://github.com/burnnat).
