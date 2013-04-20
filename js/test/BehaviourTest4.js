/*
	Scenario : call Behaviour.AttachListener() twice, then trigger event(s), then test results
*/

BehaviourTest4 = TestCase.extend({
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
		 	return value === 4;
		 },
		 'testClosingDispatcher' : function(value){
		 	return value === 2;
		 },
		 'testTuple' : function(value){
		 	return (value === 4);
		 },
		 'testDispatcher' : function(value){
		 	return value === 2;
		 },
		 'testReceiver' : function(value){
		 	return value === 4;
		 },
		 'testDispatchingReceiver' : function(value){
		 	return value === 2;
		 }
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
	},
	testClosingReceiver : function(){
		var b = new Behaviour();
		var x = new Backbone.Model();
		var self = this;
		var handler = { 
			handler : function(){
				self.results['testClosingReceiver']++;}
		};

		b.attachListener('closing_receiver', 
		x, [x, x],['change', 'sync'],
		[
			handler, handler
		],{ bindOnAttach : true});

		b.attachListener('closing_receiver', 
		x,[x, x],['change', 'sync'],
		[
			handler, handler
		],{ bindOnAttach : true});

		x.trigger('change');
		x.trigger('sync');
		
		this.alertResults('testClosingReceiver');
	},
	testClosingDispatcher :function(){
		var b = new Behaviour();
		var self = this;
		var handlerX = { handler : function(){ self.results['testClosingDispatcher'] += 2;}};
		var handlerY = { handler : function(){ self.results['testClosingDispatcher']--;}}
		var x = new Backbone.Model();

		b.attachListener('closing_dispatcher', 
			x,[x, x],['change', 'sync'], 
			[
				handlerX,
				handlerY
			], { bindOnAttach : true});

		b.attachListener('closing_dispatcher', 
			x,[x, x],['change', 'sync'], 
			[
				handlerX,
				handlerY
			], { bindOnAttach : true});

		x.trigger('change');
		x.trigger('sync');
		this.alertResults('testClosingDispatcher');
	},
	testTuple : function(){
		var x = new Backbone.Model(),y = new Backbone.Model();
		var b = new Behaviour();
		var self = this;
		var handler = { handler : function(){ self.results['testTuple']++;} };

		b.attachListener('tuple', 
		x,[y, y], 
		['change', 'sync'], 
		[
			handler,
			handler
		], {bindOnAttach : true});

		b.attachListener('tuple', 
		x,[y, y], 
		['change', 'sync'], 
		[
			handler,
			handler
		], {bindOnAttach : true});

		y.trigger('change');
		y.trigger('sync');
		this.alertResults('testTuple');
	},
	testDispatcher : function(){
		var x = new Backbone.Model(),y = new Backbone.Model();
		var b = new Behaviour();
		var self = this;
		var handlerX = { handler : function(){ self.results['testDispatcher'] += 2;} };
		var handlerY = { handler : function(){ self.results['testDispatcher']--;} };

		b.attachListener('dispatcher',
		x,[y,y],['change', 'sync'],
		[
			handlerX,
			handlerY
		], {bindOnAttach : true});

		b.attachListener('dispatcher',
		x,[y,y],['change', 'sync'],
		[
			handlerX,
			handlerY
		], {bindOnAttach : true});

		y.trigger('change');
		y.trigger('sync');
		this.alertResults('testDispatcher');
	},
	testReceiver : function(){
		var x = new Backbone.Model();
		var y = new Backbone.Model(), z = new Backbone.Model();
		var b = new Behaviour();
		var self = this;
		var handler = { 
			handler : function(){ self.results['testReceiver']++},
		};

		b.attachListener('receiver', 
		x,[y,z],['change', 'change'],
		[
			handler,
			handler
		],
		{bindOnAttach : true});

		b.attachListener('receiver', 
		x,[y,z],['change', 'change'],
		[
			handler,
			handler
		],
		{bindOnAttach : true});

		y.trigger('change');
		z.trigger('change');
		this.alertResults('testReceiver');
	},
	testDispatchingReceiver : function(){
		var x = new Backbone.Model();
		var y = new Backbone.Model(), z = new Backbone.Model();
		var handlerX = {
			handler : function(){ self.results['testDispatchingReceiver'] += 2;}	
		};
		var handlerY  = {
			handler : function(){ self.results['testDispatchingReceiver']--;}
		};
		var b = new Behaviour();
		var self = this;

		b.attachListener('dispatching_receiver', 
		x, [y,z], ['change', 'sync'],
		[
			handlerX,
			handlerY
		], {bindOnAttach : true});

		b.attachListener('dispatching_receiver', 
		x, [y,z], ['change', 'sync'],
		[
			handlerX,
			handlerY
		], {bindOnAttach : true});

		y.trigger('change');
		z.trigger('change');
		this.alertResults('testDispatchingReceiver');	
	},
	header : function(){
		console.log('------------------------TEST CASE 4----------------------');
		console.log('------------------------TESTING Behaviour.js-------------');
		console.log('Scenario : call Behaviour.AttachListener() twice, then trigger event(s), then test results');
	},
	execute : function(){
		this.header();
		
		this.testLink();
		this.testClosure();
		this.testClosingReceiver();
		this.testClosingDispatcher();
		this.testTuple();
		this.testDispatcher();
		this.testReceiver();
		this.testDispatchingReceiver();
	}
})


