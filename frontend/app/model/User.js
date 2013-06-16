Ext.define('Scrum.model.User', {
	extend : 'Ext.data.Model',
	fields : [
		{ name : 'firstname', type : 'string'},
		{ name : 'lastname', type : 'string'},
		{ 
			name : 'login_time',
			type : 'date',
			sortType : function(date){
				return date.getTime();
			},
			convert : function(value, record){
				if (Ext.isNumeric(value))
					return new Date(value * 1000);
				else if (Ext.isDate(value))
					return value;
			}
		},
		{
			name : 'description',
			type : 'string'
		}
	],
	proxy : {
		type : "ajax",
		url : '/users/get',
		reader : {
			type : 'json',
			root : 'user',
			successProperty : 'success'
		}
	}
});