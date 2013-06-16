Ext.define('Scrum.store.Users', {
	extend : 'Ext.data.Store',
	pageSize : 25,
	requires : ['Scrum.model.User'],
	model : 'Scrum.model.User', 
	proxy : {
		type: 'ajax',
        url: '/users/get',
        reader: {
	        type: 'json',
	        root: 'users',
	        successProperty: 'success'
		}
	}
});