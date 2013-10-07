Siesta.REPORTER = true;

Siesta.Harness.meta.extend({
	methods: {
		generateJSONReport: function() {
			return {
				durationSec: (this.endDate - this.startDate) / 1000,
				passed: this.allPassed(),
				suites: this.descriptors.map(
					function(descriptor) {
						var suite = this.getSuiteResults(
							this.testsByURL[descriptor.url].getResults().toJSON()
						);
						
						if (suite.totalCount) {
							return Ext.apply(
								Ext.copyTo(
									{},
									suite,
									[
										'description',
										'durationSec',
										'passed'
									]
								),
								{
									specs: [
										Ext.apply(suite, { description: '[all]' })
									]
								}
							);
						}
						else {
							return suite;
						}
					},
					this
				)
			};
		},
		
		getSuiteResults: function(results) {
			var output = {
				description: results.name || results.url.replace(/^.*\//, ''),
				durationSec: (results.endDate - results.startDate) / 1000,
				passed: results.passed
			};
			
			var suites = [];
			var specs = [];
			
			var pass = 0;
			var fail = 0;
			var total = 0;
			
			results.assertions.forEach(
				function(child) {
					if (child.type === "Siesta.Result.SubTest") {
						(child.bddSpecType === 'describe'
								? suites
								: specs)
							.push(
								this.getSuiteResults(child)
							);
					}
					else {
						if (child.passed)
							pass++;
						else {
							fail++;
						}
						
						total++;
					}
				},
				this
			);
			
			if (suites.length || specs.length) {
				return Ext.apply(output, {
					suites: suites,
					specs: specs
				});
			}
			else {
				return Ext.apply(output, {
					passedCount: pass,
					failedCount: fail,
					totalCount: total
				});
			}
		}
	}
});