TestCase = Backbone.Object.extend({
	results : {},
	checkers : {},
	alertResults : function(testCaseName){
		var checker = this.checkers[testCaseName];
		if (!checker(this.results[testCaseName]))
			console.warn('test case : ' + testCaseName + ' failure');
		else 
			console.log('test case : ' + testCaseName + ' success');
	},
	header : function(){ return false;},
	execute : function(){ return false;}
})