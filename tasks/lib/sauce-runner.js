var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var webdriver = require('wd');
var SauceLabs = require('saucelabs');
var SauceTunnel = require('sauce-tunnel');
var spawn = require('child_process').spawn;

module.exports = {
	
	createTunnel: function(grunt, options, callback) {
		var _ = grunt.util._;
		
		if (this.tunnel) {
			callback(this.tunnel);
			return;
		}
		
		var tunnel = this.tunnel = new SauceTunnel(
			options.username,
			options.key,
			options.identifier,
			true,
			options.tunnelTimeout
		);
		
		var methods = ['write', 'writeln', 'error', 'ok', 'debug'];
		methods.forEach(function (method) {
			tunnel.on('log:' + method, function (text) {
				grunt.log[method](text);
			});
			
			tunnel.on('verbose:' + method, function (text) {
				grunt.verbose[method](text);
			});
		});
		
		grunt.log.writeln("=> Connecting to Saucelabs ...");
		
		tunnel.start(function(created) {
			if (!created) {
				grunt.log.error('Failed to create SauceConnect tunnel.');
				return callback(null);
			}
			
			grunt.log.ok("Connected to Saucelabs.");
			
			/*
			 * Okay, so this is pretty hacky... but we can't perform async cleanup
			 * using process.on('exit'), so we monkey-patch the grunt exit method
			 * to allow us to perform our cleanup and complete the exit afterward.
			 */
			grunt.util.exit = _.wrap(
				grunt.util.exit,
				function(original, code) {
					var scope = this;
					var args = _.last(arguments, 1);
					
					tunnel.stop(function() {
						grunt.log.writeln('Tunnel connection closed.');
						original.call(scope, args);
					});
				}
			);
			
			process.on(
				'exit',
				function() {
					tunnel.stop(function() {
						grunt.log.writeln('Tunnel connection closed.');
					});
				}
			);
			
			callback(tunnel);
		});
	},
	
	drive: function(grunt, driverConfig, options, callback) {
		var _ = grunt.util._;
		
		var logError = function(message, error) {
			message = message + ': ' + (_.isObject(error) ? error.message : error);
			
			if (error.data) {
				var data = JSON.parse(error.data);
				
				if (data.value && data.value.message) {
					message = message + ' [ ' + data.value.message + ' ]';
				}
			}
			
			grunt.log.error(message);
		};
		
		var queue = grunt.util.async.queue(
			function(browserConfig, rootCallback) {
				var browser = webdriver.promiseChainRemote(driverConfig);
				
				var browserCallback = browserConfig.callback
					? function(err) {
						browserConfig.callback(err, browser, rootCallback);
					}
					: rootCallback;
				
				if (options.logging) {
					browser.on('status', function(info){
						grunt.log.writeln('\x1b[36m%s\x1b[0m', info);
					});
					
					browser.on('log', function(message){
						grunt.log.writeln(' > \x1b[36mLOG\x1b[0m: %s', message);
					});
					
					browser.on('command', function(method, path){
						grunt.log.writeln(' > \x1b[33m%s\x1b[0m: %s', method, path);
					});
					
					browser.on('promise', function(context, method, args, status) {
						var context = context === browser
							? '[]'
							: '[element ' + context.value + ']';
						
						args = _.clone(args);
						
						if (_.isFunction(_.last(args))) {
							args.pop();
						}
						
						args = args.map(function(arg) {
							if (arg instanceof browser._Element) {
								return '[element ' + arg.toString() + ']';
							}
							else {
								return JSON.stringify(arg);
							}
						});
						
						grunt.log.verbose.writeln(
							' --> %s %s %s ( %s )',
							status,
							context,
							method,
							args.join(', ')
						);
					});
				}
				
				var scriptCallback = function(err) {
					if (browser.saucePassed === false) {
						var message = 'Javascript tests failed.';
						
						if (options.mirrorTestFailure) {
							err = message;
						}
						else {
							grunt.log.error(message);
						}
					}
					
					if (err) {
						logError('Script ended with error', err);
					}
					else {
						grunt.log.ok('Script run completed.');
					}
					
					browserCallback(err);
				};
				
				if (options.slow) {
					var ignore = /^chain$|^toString$|^_/;
					
					_.each(
						_.functions(browser),
						function(name) {
							if (ignore.test(name) || EventEmitter.prototype[name]) {
								return;
							}
							
							var original = browser[name];
							
							browser[name] = function() {
								return original.apply(this, arguments).delay(500);
							};
						}
					);
				}
				
				browser.init(browserConfig)
					.fail(function(err) {
						logError('Unable to initialize browser', err);
						browserCallback(err);
					})
					.get(options.url)
					.then(function() {
						return options.script(browser, options);
					})
					.fin(function() {
						if (options.autoclose) {
							return browser.quit();
						}
					})
					.done(
						function() {
							scriptCallback();
						},
						function(err) {
							scriptCallback(err);
						}
					);
			},
			options.concurrency
		);
		
		var failures;
		
		queue.drain = function() {
			if (failures) {
				grunt.log.error('One or more tests failed.');
			}
			
			callback(failures);
		};
		
		options.browsers.forEach(function(browserConfig) {
			var browserId = [browserConfig.browserName, browserConfig.version, browserConfig.platform].join(':');
			
			browserConfig.name = options.testname;
			browserConfig.tags = options.tags;
			browserConfig.build = options.build;
			
			var tunnelId = options['tunnel-identifier'];
			
			if (tunnelId) {
				browserConfig['tunnel-identifier'] = tunnelId;
			}
			
			browserConfig.callback = browserConfig.callback || options.callback;
			
			queue.push(
				browserConfig,
				function(err) {
					if (err) {
						failures = failures || {};
						failures[browserId] = err;
					}
				}
			);
		});
	},
	
	run: function(grunt, options, done) {
		if (!options.local) {
			if (options.tunneled) {
				var me = this;
				
				this.createTunnel(
					grunt,
					options,
					function(tunnel) {
						if (!tunnel) {
							done(false);
						}
						else {
							options['tunnel-identifier'] = tunnel.identifier;
							
							me.runRemote(
								grunt,
								options,
								function(err) {
									done(options.ignoreFailure || !err);
								}
							);
						}
					}
				);
			}
			else {
				this.runRemote(grunt, options, done);
			}
		}
		else {
			var os = {
				win32: /^(windows|vista|xp)/i,
				linux: /^linux/i,
				darwin: /^(mac|os x)/i
			};
			
			var platformTest = os[process.platform];
			var matches = [];
			
			options.browsers.forEach(function(browser) {
				var name = browser.browserName;
				var platform = browser.platform;
				
				if (
					name === 'chrome'
					&& platformTest.test(platform)
				) {
					grunt.log.verbose.writeln('Adding browser: ' + name);
					matches.push({
						browserName: name
					});
				}
				else {
					grunt.log.verbose.writeln("Skipping unsupported browser: " + name + " on " + platform)
				}
			});
			
			options.browsers = matches = _.unique(matches, 'browserName');
			
			if (matches.length < 1) {
				grunt.log.error("No supported local browsers found");
				return done(false);
			}
			
			grunt.log.writeln("=> Starting local WebDriver ...");
			
			var scriptErr;
			var driverPort = options.driverPort;
			
			var driver = spawn(
				'chromedriver',
				['--port=' + driverPort]
			);
			
			driver.on('error', function(error) {
				if (error.code === 'ENOENT') {
					driver = null;
					grunt.log.error('Unable to locate local WebDriver.');
					done(false);
				}
				else {
					throw error;
				}
			});
			
			driver.stderr.on('data', function(data) {
				grunt.log.verbose.writeln(data);
			});
			
			driver.on('close', function(code) {
				if (!driver) {
					return;
				}
				
				if (code) {
					grunt.log.error('Local WebDriver terminated with error: ' + code);
				}
				else {
					grunt.log.writeln('Local WebDriver terminated.');
				}
				
				done(options.ignoreFailure || !scriptErr);
			});
			
			this.drive(
				grunt,
				{
					host: '127.0.0.1',
					port: driverPort,
					path: '/'
				},
				options,
				function(err) {
					scriptErr = err;
					driver.kill();
				}
			);
		}
	},
	
	runRemote: function(grunt, options, done) {
		var sauce = new SauceLabs({
			username: options.username,
			password: options.key
		});
		
		// Update SauceLabs job status as browser run completes.
		options.callback = function(browserError, browser, next) {
			var job = browser.sessionID;
			
			sauce.updateJob(
				job,
				{
					passed: !browserError && browser.saucePassed !== false
				},
				function(err) {
					if (err) {
						err = err.errors;
						grunt.log.error('Error updating SauceLabs status for job ' + job + ': ' + err);
					}
					else {
						grunt.log.verbose.writeln('Updated SauceLabs status for job: ' + job);
					}
					
					if (browser.sauceData) {
						sauce.updateJob(
							job,
							{
								'custom-data': browser.sauceData
							},
							function(warn) {
								if (warn) {
									grunt.log.warn('Error updating SauceLabs data for job ' + job + ': ' + warn.errors);
								}
								else {
									grunt.log.verbose.writeln('Updated SauceLabs data for job: ' + job);
								}
								
								next(browserError || err);
							}
						);
					}
					else {
						next(browserError || err);
					}
				}
			);
		};
		
		this.drive(
			grunt,
			{
				host: 'ondemand.saucelabs.com',
				port: 80,
				username: options.username,
				accessKey: options.key
			},
			options,
			done
		);
	}
}
