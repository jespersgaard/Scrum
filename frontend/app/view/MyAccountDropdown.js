Ext.define('Scrum.view.MyAccountDropdown', {
	extend : 'Ext.button.Split',
	xtype : 'scrum-account-dropdown',
	text : 'My Account',
	menu : { 
		items : [
			{ text : "Preferences", action : 'preferences'},
			{ xtype : 'menuseparator' },
			{ text : 'Logout', action : 'logout'}
		]
	}
});