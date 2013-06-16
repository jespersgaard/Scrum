Ext.define('Scrum.view.userstory.Backlog', {
	extend : 'Ext.panel.Panel',
	xtype : 'scrum-backlog',
	layout : { type : "hbox", align : 'stretch'},
	require : [
		'Scrum.view.userstory.BacklogOverview',
		'Scrum.view.userstory.RightPart'
	],
	items : [
		Ext.create('Scrum.view.userstory.BacklogOverview', {
			flex : 1,
			collapsible : true,
			collapseDirection : 'top'
		}),
		Ext.create('Scrum.view.userstory.RightPart', {
			flex : 1
		})
	]
})