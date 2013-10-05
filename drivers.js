/**
 * Drivers for various test frameworks.
 */
module.exports = {
	jasmine: require('./drivers/jasmine.js').init(defaults),
	siesta: require('./drivers/siesta.js').init(defaults)
};