/*
	Scenario : call Behaviour.AttachListener() twice, then trigger event(s), then test results
*/

BehaviourTest = {
	results : {
		'testLink' : 0, 
		'testClosure' : 0, 
		'testClosingReceiver' : 0, 
		'testClosingDispatcher' : 0, 
		'testTuple' : 0,
		'testReceiver' : 0,
		'testDispatcher' : 0,
		'testDispatchingReceiver' : 0
		}, 
	checkers : {
		 'testLink' :function(value){
		 	return value === 2;
		 },
		 'testClosure' : function(value){
		 	return value === 2;
		 },
		 'testClosingReceiver' : function(value){
		 	return (value === 2);
		 },
		 'testClosingDispatcher' : function(value){
		 	return value > 0;
		 },
		 'testTuple' : function(value){
		 	return (value === 2);
		 },
		 'testDispatcher' : function(value){
		 	return value > 0;
		 },
		 'testReceiver' : function(value){
		 	return (value === 2);
		 },
		 'testDispatchingReceiver' : function(value){
		 	return value > 0;
		 }
		},
	alertResults : function(testCaseName){
		var checker = this.checkers[testCaseName];
		if (!checker(this.results[testCaseName]))
			console.log('test case : ' + testCaseName + ' failure');
		else 
			console.log('test case : ' + testCaseName + ' success');
	},
	testLink : function(){
		var x = new Backbone.Model(),y = new Backbone.Model();
		var self = this;
		var fn = { 
			handler : function(){ 
			self.results['testLink']++;
		}};

		var b = new Behaviour();
		//test case 1
		b.attachListener('link_listener', 
			x, y,'change', fn, { bindOnAttach : true});
		b.attachListener('link_listener', 
			x, y,'change', fn, { bindOnAttach : true});

		y.trigger('change');

		this.alertResults('testLink');
	},
	testClosure : function(){
		var x = new Backbone.Model();
		var b = new Behaviour();
		var self = this;
		var handler = {
			handler : function(){
				self.results['testClosure']++;
			}
		};

		b.attachListener('closure_listener',
			x, x,
			'change',
			handler, { bindOnAttach : true});
		b.attachListener('closure_listener',
			x, x,
			'change',
			handler, { bindOnAttach : true});

		x.trigger('change');
		this.alertResults('testClosure');
	}/*,
	testClosingReceiver : function(){
		var b = new Behaviour();
		var self = this;

		b.attachListener('closing_receiver', 
		x = new Backbone.Model(), 
		[x, x],
		['change', 'sync'],
		[
			{
				handler : function(){
					self.results['testClosingReceiver']++;}
			},
			{
				handler : function(){
					self.results['testClosingReceiver']++;		
				}
			}
		],{ bindOnAttach : true});
		x.trigger('change');
		x.trigger('sync');
		
		this.alertResults('testClosingReceiver');
	},
	testClosingDispatcher :function(){
		var b = new Behaviour();
		var self = this;

		b.attachListener('closing_dispatcher', 
			x = new Backbone.Model(),
			[x, x], 
			['change', 'sync'], 
			[
				{ handler : function(){ self.results['testClosingDispatcher'] += 2;}},
				{ handler : function(){ self.results['testClosingDispatcher']--;}}
			], { bindOnAttach : true});
		x.trigger('change');
		x.trigger('sync');
		this.alertResults('testClosingDispatcher');
	},
	testTuple : function(){
		var b = new Behaviour();
		var self = this;

		b.attachListener('tuple', 
		x = new Backbone.Model(),
		[y = new Backbone.Model(), y], 
		['change', 'sync'], 
		[
			{ handler : function(){ self.results['testTuple']++;} },
			{ handler : function(){ self.results['testTuple']++;} }
		], {bindOnAttach : true});
		y.trigger('change');
		y.trigger('sync');
		this.alertResults('testTuple');
	},
	testDispatcher : function(){
		var b = new Behaviour();
		var self = this;

		b.attachListener('dispatcher',
		x = new Backbone.Model(),
		y = new Backbone.Model(),
		['change', 'sync'],
		[
			{ handler : function(){ self.results['testDispatcher'] += 2;} },
			{ handler : function(){ self.results['testDispatcher']--;} }
		], {bindOnAttach : true});
		y.trigger('change');
		y.trigger('sync');
		this.alertResults('testDispatcher');
	},
	testReceiver : function(){
		var b = new Behaviour();
		var self = this;

		b.attachListener('receiver', 
		x = new Backbone.Model(),
		[y = new Backbone.Model(), z = new Backbone.Model()],
		['change', 'change'],
		[
			{ 
				handler : function(){ self.results['testReceiver']++},
			},
			{ 
				handler : function(){ self.results['testReceiver']++},
			}
		],
		{bindOnAttach : true});

		y.trigger('change');
		z.trigger('change');
		this.alertResults('testReceiver');
	},
	testDispatchingReceiver : function(){
		var b = new Behaviour();
		var self = this;

		b.attachListener('dispatching_receiver', 
		x = new Backbone.Model(), 
		[y = new Backbone.Model(), z = new Backbone.Model()], 
		['change', 'sync'],
		[
			{ handler : function(){ self.results['testDispatchingReceiver'] += 2;}},
			{ handler : function(){ self.results['testDispatchingReceiver']--;}}
		], {bindOnAttach : true});

		y.trigger('change');
		z.trigger('change');
		this.alertResults('testDispatchingReceiver');	
	}*/
}

console.log('------------------------TEST CASE 4----------------------');
console.log('------------------------TESTING Behaviour.js-------------');
console.log('Scenario : call Behaviour.AttachListener() twice, then trigger event(s), then test results');
BehaviourTest.testLink();
BehaviourTest.testClosure();
/*BehaviourTest.testClosingReceiver();
BehaviourTest.testClosingDispatcher();
BehaviourTest.testTuple();
BehaviourTest.testDispatcher();
BehaviourTest.testReceiver();
BehaviourTest.testDispatchingReceiver();*/