Ext.define('Scrum.types.Enumerable', {
    requires: ['Ext.data.Types'],
    singleton : true, 
    constructor : function(){
		var type = Ext.define('Ext.data.Types.Enumerable', {
			extend : 'Ext.Base'
		});

		type.addStatics({
			VD_PAIRS : {
		    
			},
			DV_PAIRS : {
				
			},
			convert: function(status, record) {
	        	if (Ext.isObject(status))
	        		return status;
	        	else if (Ext.isNumeric(status))
	        		return { value : parseInt(status), display : this.VD_PAIRS[status]};

	        	return null;
	 		},
	 
	   	 	getValues : function(){
	   	 		var arr = [];
	   	 		for (value in this.VD_PAIRS){
	   	 			arr.push(parseInt(value));
	   	 		}

	   	 		return arr;
	   	 	},
	   	 	
	   	 	getDisplays : function(){
	   	 		var arr = [];
	   	 		for (value in this.VD_PAIRS){
	   	 			arr.push(this.VD_PAIRS[parseInt(value)]);
	   	 		}

	   	 		return arr;	
	   	 	},
	   	 	
	   	 	getHashes : function(){
	   	 		var arr = [];
	   	 		for (value in this.VD_PAIRS){
	   	 			arr.push({ value : parseInt(value), display : this.VD_PAIRS[value]})
	   	 		}

	   	 		return arr;
	   	 	},
	   	 	
	   	 	getPairs : function(){
	   	 		var arr = [];
	   	 		for (value in this.VD_PAIRS){
	   	 			value = parseInt(value);
	   	 			arr.push([value, this.VD_PAIRS[value]]);
	   	 		}

	   	 		return arr;
	   	 	},
	   	 		
	   	 	getFromValue : function(value){
	   	 		if (value in this.VD_PAIRS){
	   	 			value = parseInt(value);
	   	 			return { value : value, display : this.VD_PAIRS[value]};
	   	 		}

	   	 		return null;
	   	 	},
	   	 	
	   	 	getFromDisplay : function(display){
	   	 		if (value in this.DV_PAIRS){
	   	 			return { display : display, value : this.DV_PAIRS[display]};
	   	 		}

	   	 		return null;
	   	 	}	
		}); 
	}
});