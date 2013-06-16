Ext.define('Scrum.view.ContentPanel', {
	xtype : 'scrum-contentpanel',
	extend : 'Ext.panel.Panel',
	require : [
		'Scrum.view.userstory.Backlog',
		'Scrum.view.project.Profile',
		'Scrum.view.sprint.SprintManager'
	],
	layout : {
		type : 'card'
	},
	border : false,
	cls : 'scrum-contentpanel',
	items : [
		Ext.create('Ext.panel.Panel'),
		Ext.create('Scrum.view.project.Profile',{
			itemId : 'project-profile'
		}),
		Ext.create('Scrum.view.userstory.Backlog', {
			itemId : 'userstory-backlog'
		}),
		Ext.create('Scrum.view.sprint.SprintManager', {
			itemId : 'sprint-manager'
		}),
		Ext.create('Scrum.view.team.TeamManager', {
			itemId : 'team-manager'
		})
	]
});