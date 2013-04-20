(function(){
	var root = this;
	var Backbone = root.Backbone;
	var _ = root._;
	
	var Object = Backbone.Object = function(attributes, options){
		var defaults;
	    var attrs = attributes || {};
	    options || (options = {});
	    this.obj_id = _.uniqueId('obj'); 
	    
	    if (defaults = _.result(this, 'defaults')) {
		    attrs = _.defaults({}, attrs, defaults);
		}
	    this.set(attrs, options);
	    this.initialize.apply(this, arguments);
	}
	
	/*not observable object*/
	_.extend(Object.prototype, Backbone.Events, {
		set : function(key, val, options){
			var attr, attrs, unset, current;
     	 	if (key == null) return this;
     	 	  // Handle both `"key", value` and `{key: value}` -style arguments.
		      if (typeof key === 'object') {
		        attrs = key;
		        options = val;
		      } else {
		        (attrs = {})[key] = val;
		      }

		      // Extract attributes and options.
		      unset           = options.unset;
		      
		      for (attr in attrs) {
		      	val = attrs[attr];
		        unset ? delete this[attr] : this[attr] = val;
		      }
		},
		unset: function(attr, options) {
      		return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    	},
    	clear: function(options) {
	      var attrs = {};
	      for (var key in this.attributes) attrs[key] = void 0;
	      return this.set(attrs, _.extend({}, options, {unset: true}));
    	},
    	clone: function() {
      		return new this.constructor(this.attributes);
    	},
    	initialize: function(){}
	});
	
	Object.extend = (Backbone.Model.extend || Backbone.Collection.extend || 
			Backbone.Router.extend || Backbone.View.extend || 
			Backbone.History.extend || function(protoProps, staticProps){
		var parent = this;
	    var child;

	    // The constructor function for the new subclass is either defined by you
	    // (the "constructor" property in your `extend` definition), or defaulted
	    // by us to simply call the parent's constructor.
	    if (protoProps && _.has(protoProps, 'constructor')) {
	      child = protoProps.constructor;
	    } else {
	      child = function(){ return parent.apply(this, arguments); };
	    }

	    // Add static properties to the constructor function, if supplied.
	    _.extend(child, parent, staticProps);

	    // Set the prototype chain to inherit from `parent`, without calling
	    // `parent`'s constructor function.
	    var Surrogate = function(){ this.constructor = child; };
	    Surrogate.prototype = parent.prototype;
	    child.prototype = new Surrogate;

	    // Add prototype properties (instance properties) to the subclass,
	    // if supplied.
	    if (protoProps) _.extend(child.prototype, protoProps);

	    // Set a convenience property in case the parent's prototype is needed
	    // later.
	    child.__super__ = parent.prototype;

	    return child;
	});
}).call(this);