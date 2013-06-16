st = Ext.create('Ext.data.Store', {
	fields : ['firstname', 'id'],
	data : [
		{ id : 1, firstname : 'Bob'},
		{ id : 2, firstname : 'Stanley'},
		{ id : 3, firstname : 'Mark'}
	]
})

Ext.define('Scrum.view.userstory.form.AttachTeamForm', {
	extend : 'Ext.form.Panel',
	title : 'Attach a team',
	require : [
		'Ext.ux.form.MultiSelect',
		'Ext.ux.form.ItemSelector'
	],
	layout : 'fit',
	items : [{
		xtype : 'itemselector',
		name : 'team_selector',
		id : 'team_selector_field',
		anchor : '100%',
		fieldLabel : 'Team Selector',
		/*listConfig : {
			itemTpl : '{firstname} {lastname}'
		},*/
		store : st,
		fromTitle: 'Available',
        toTitle: 'Selected',
        displayField : 'firstname',
		valueField : 'id'
	}]
})