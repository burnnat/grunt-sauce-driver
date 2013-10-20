# 0.1.0 / 2013-10-19

 * [FEATURE] Add support for Internet Explorer when running locally.
 * [ENHANCEMENT] Update to use chained promises API from WebDriver 0.2.0.
 * [ENHANCEMENT] Add ability to specify delay time when running in "slow" mode.
 * [BUGFIX] Fix Javascript errors when running Siesta tests in older browsers.

# 0.0.3 / 2013-10-10

 * [FEATURE] Add `mirrorTestFailure` and `ignoreFailure` options for finer control of test pass/fail status.
 * [ENHANCEMENT] Automatically retry failed tests in Siesta, to work around SauceLabs browser issues with running Siesta.
 * [BUGFIX] Ignore any unsupported browsers when running locally.

# 0.0.2 / 2013-10-07

 * [ENHANCEMENT] Terminate task immediately with error message if any required options are missing.
 * [BUGFIX] Prevent from hanging when no custom data is supplied by the test script.

# 0.0.1 / 2013-10-06

 * Initial release.