/*
Scenario : call Behaviour.AttachListeners(), then trigger event(s), 
and execution of all listeners is success condition of this test
*/
BehaviourTest2 = TestCase.extend({
	results : {
		'testLinks' : { a : null, b : null } , 
		'testClosures' : { a : null, b : null }, 
		'testClosingReceivers' : { a : 0, b : 0}, 
		'testClosingDispatchers' : { a : 0, b : 0}, 
		'testTuples' : { a : 0, b : 0},
		'testReceivers' : { a : 0, b : 0},
		'testDispatchers' : { a : 0, b : 0},
		'testDispatchingReceivers' : { a : 0, b : 0}
	},
	checkers : {
		'testLinks' : function(value){
			return !_.isNull(value.a) && !_.isNull(value.b);
		},
		'testClosures' : function(value){
			return !_.isNull(value.a) && !_.isNull(value.b);
		},
		'testClosingReceivers' : function(value){
			return (value.a === 2 && value.b === 2);
		},
		'testClosingDispatchers' : function(value){
			return (value.a === 1 && value.b === 1);
		},
		'testTuples' : function(value){
			return (value.a === 2 && value.b === 2);
		},
		'testDispatchers' : function(value){
			return (value.a === 1 && value.b === 1);
		},
		'testReceivers' : function(value){
			return (value.a === 2 && value.b === 2);	
		},
		'testDispatchingReceivers' : function(value){
			return (value.a === 1 && value.b === 1);
		}
	},
	testLinks : function(){
		var x,y,w,q;
		var self = this;
		var b = new Behaviour();

		var linkListenerX = { 
			listener : x = new Backbone.Model(),
			senders : y = new Backbone.Model(),
			events: 'change',
			fns : { handler : function(){ self.results['testLinks']['a'] = true;}}
		}
		var linkListenerY = {
			listener : w = new Backbone.Model(),
			senders : q = new Backbone.Model(),
			events: 'change',
			fns : { handler : function(){ self.results['testLinks']['b'] = true;}}	
		}

		b.attachListeners({ 'linkListenerX' : linkListenerX, 'linkListenerY' : linkListenerY}, { bindOnAttach : true })
		
		y.trigger('change');
		q.trigger('change');

		this.alertResults('testLinks');
	},
	testClosures : function(){
		var x,y;
		var b = new Behaviour();
		var self = this;
		var closureListenerX = {
			listener : x = new Backbone.Model(),
			senders : x, 
			events: 'change',
			fns : { handler : function(){ self.results['testClosures']['a'] = true;}}	
		};
		var closureListenerY = {
			listener : y = new Backbone.Model(),
			senders : y,
			events: 'change',
			fns : { handler : function(){ self.results['testClosures']['b'] = true;}}
		};
		b.attachListeners({ 'closureListenerX' : closureListenerX, 'closureListenerY' : closureListenerY}, { bindOnAttach : true});

		x.trigger('change');
		y.trigger('change');
		this.alertResults('testClosures');
	},
	testClosingReceivers : function(){
		var x,y;
		var b = new Behaviour();
		var self = this;
		var clsRcvListenerX = {
			listener : x = new Backbone.Model(),
			senders : [x,x],
			events : ['change', 'sync'],
			fns : [
				{ handler : function(){ self.results['testClosingReceivers']['a']++}},
				{ handler : function(){ self.results['testClosingReceivers']['a']++}}
			]
		};
		var clsRcvListenerY = {
			listener : y = new Backbone.Model(),
			senders : [y,y],
			events : ['change', 'sync'],
			fns : [
				{ handler : function(){ self.results['testClosingReceivers']['b']++}},
				{ handler : function(){ self.results['testClosingReceivers']['b']++}}
			]
		}; 
		b.attachListeners({ 'clsRcvListenerX' : clsRcvListenerX, 'clsRcvListenerY' : clsRcvListenerY}, { bindOnAttach : true});

		x.trigger('change');
		x.trigger('sync');
		y.trigger('change');
		y.trigger('sync');

		this.alertResults('testClosingReceivers');
	},
	testClosingDispatchers : function(){
		var x,y;
		var b = new Behaviour();
		var self = this;
		var clsDspListenerX = {
			listener : x = new Backbone.Model(),
			senders : [x,x],
			events : ['change', 'sync'],
			fns : [
				{ handler : function(){ self.results['testClosingDispatchers']['a'] += 2}},
				{ handler : function(){ self.results['testClosingDispatchers']['a']--;}}
			]
		};
		var clsDspListenerY = {
			listener : y = new Backbone.Model(),
			senders : [y,y],
			events : ['change', 'sync'],
			fns : [
				{ handler : function(){ self.results['testClosingDispatchers']['b'] += 2}},
				{ handler : function(){ self.results['testClosingDispatchers']['b']--;}}
			]
		}; 
		b.attachListeners({ 'clsDspvListenerX' : clsDspListenerX, 'clsDspListenerY' : clsDspListenerY}, { bindOnAttach : true});

		x.trigger('change');
		x.trigger('sync');
		y.trigger('change');
		y.trigger('sync');

		this.alertResults('testClosingDispatchers');
	},
	testTuples : function(){
		var x,y;
		var w,q;
		var self = this;
		var tupleListenerX,tupleListenerY;
		var b = new Behaviour();

		tupleListenerX = {
			listener : x = new Backbone.Model(),
			senders : [y = new Backbone.Model(), y],
			events : ['change', 'sync'],
			fns : [
				{ handler : function(){ self.results['testTuples']['a']++}},
				{ handler : function(){ self.results['testTuples']['a']++}}
			]
		};
		tupleListenerY = {
			listener : w = new Backbone.Model(),
			senders : [q = new Backbone.Model(), q],
			events : ['change', 'sync'],
			fns : [
				{ handler : function(){ self.results['testTuples']['b']++}},
				{ handler : function(){ self.results['testTuples']['b']++}}
			]
		};
		b.attachListeners({ 'tupleListenerX' : tupleListenerX, 'tupleListenerY' : tupleListenerY}, { bindOnAttach : true});

		y.trigger('change');
		y.trigger('sync');
		q.trigger('change');
		q.trigger('sync');

		this.alertResults('testTuples');
	},
	testDispatchers : function(){
		var x,y;
		var q,w;
		var self = this;
		var dspListenerX, dspListenerY;
		var b = new Behaviour();

		dspListenerX = {
			listener : x = new Backbone.Model(),
			senders : [y = new Backbone.Model(), y],
			events : ['change', 'sync'],
			fns : [
				{ handler : function(){ self.results['testDispatchers']['a'] += 2;}},
				{ handler : function(){ self.results['testDispatchers']['a']--;}}
			]
		},
		dspListenerY = {
			listener : q = new Backbone.Model(),
			senders : [w = new Backbone.Model(), w],
			events : ['change', 'sync'],
			fns : [
				{ handler : function(){ self.results['testDispatchers']['b'] += 2;}},
				{ handler : function(){ self.results['testDispatchers']['b']--;}}
			]
		}
		b.attachListeners({ 'dspListenerX' : dspListenerX, 'dspListenerY' : dspListenerY}, { bindOnAttach : true});

		y.trigger('change');
		y.trigger('sync');
		w.trigger('change');
		w.trigger('sync');

		this.alertResults('testDispatchers');
	},
	testReceivers : function(){
		var x,y,z;
		var q,w,u;
		var self = this;
		var rcvListenerX, rcvListenerY;
		var b = new Behaviour();

		rcvListenerX = {
			listener : x = new Backbone.Model(),
			senders : [y = new Backbone.Model(), z = new Backbone.Model()],
			events : ['change', 'sync'],
			fns : [
				{ 
					handler : function(){ 
						self.results['testReceivers']['a']++;
					}
				},
				{ 
					handler : function(){ 
						self.results['testReceivers']['a']++;
					}
				}
			]
		};
		rcvListenerY = {
			listener : q = new Backbone.Model(),
			senders : [w = new Backbone.Model(), u = new Backbone.Model()],
			events : ['change', 'sync'],
			fns : [
				{ 
					handler : function(){ 
						self.results['testReceivers']['b']++;
					}
				},
				{ 
					handler : function(){ 
						self.results['testReceivers']['b']++;
					}
				}
			]
		};
		b.attachListeners({ 'rcvListenerX' : rcvListenerX, 'rcvListenerY' : rcvListenerY}, { bindOnAttach : true});

		y.trigger('change');
		z.trigger('sync');
		w.trigger('change');
		u.trigger('sync');

		this.alertResults('testReceivers');
	},
	testDispatchingReceivers : function(){
		var x,y,z;
		var q,w,u;
		var self = this;
		var dspRcvListenerX, dspRcvListenerY;
		var b = new Behaviour();

		dspRcvListenerX = {
			listener : x = new Backbone.Model(),
			senders : [y = new Backbone.Model(), z = new Backbone.Model()],
			events : ['change', 'sync'],
			fns : [
				{ handler : function(){ self.results['testDispatchingReceivers']['a'] += 2;}},
				{ handler : function(){ self.results['testDispatchingReceivers']['a']--;}}
			]
		};
		dspRcvListenerY = {
			listener : q = new Backbone.Model(),
			senders : [w = new Backbone.Model(), u = new Backbone.Model()],
			events : ['change', 'sync'],
			fns : [
				{ handler : function(){ self.results['testDispatchingReceivers']['b'] += 2;}},
				{ handler : function(){ self.results['testDispatchingReceivers']['b']--;}}
			]
		};
		b.attachListeners({ 'dspRcvListenerX' : dspRcvListenerX, 'dspRcvListenerY' : dspRcvListenerY}, { bindOnAttach : true});

		y.trigger('change');
		z.trigger('sync');
		w.trigger('change');
		u.trigger('sync');

		this.alertResults('testDispatchingReceivers');
	},
	header : function(){
		console.log('------------------------TEST CASE 2----------------------');
		console.log('------------------------TESTING Behaviour.js-------------');
		console.log('Scenario : Behaviour.callAttachListeners(), then trigger event(s), then test results');		
	},
	execute : function(){
		this.header();
		
		this.testLinks();
		this.testClosures();
		this.testClosingReceivers();
		this.testClosingDispatchers();
		this.testTuples();
		this.testDispatchers();
		this.testReceivers();
		this.testDispatchingReceivers();		
	}
})

