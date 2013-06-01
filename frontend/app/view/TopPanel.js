Ext.define('Scrum.view.TopPanel' , {
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'scrum-toppanel',
	require : [
		'Scrum.view.ProjectsDropdown',
		'Scrum.view.MyAccountDropdown'
	],
	cls : 'scrum-toppanel',
	items : [
		Ext.create('Scrum.view.ProjectsDropdown'),
		{
			text : 'Backlog',
			action : 'backlog'
		},
		{
			text : 'Sprints',
			action : 'sprints'
		},
		'->',
		Ext.create('Scrum.view.MyAccountDropdown')
	],
	height:40
})