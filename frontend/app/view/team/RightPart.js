Ext.define('Scrum.view.team.RightPart', {
	extend : 'Ext.container.Container',
	xtype : 'scrum-team-right-part',
	require : [
		'Scrum.view.team.Card',
		'Scrum.view.CommentPanel'
	],
	layout : { type : 'card'},
	activeTab: 0,
	items : [
		{
			itemId : 'empty-panel',
			hidden : true
		},
		{
			xtype :'tabpanel', 
			itemId : 'scrum-team-tab-panel',
			tabBar : { cls : 'scrum-tabbar'},
			flex : 2,
			layout : { type : 'fit' },
			items : [
				{
					itemId : 'empty-panel',
					hidden :  true
				},
				Ext.create('Scrum.view.team.Card', {
					title : 'Profile',
					itemId : 'profile',
					tabConfig : {
						itemId : 'profile-tab'
					}
				}),
				/*Ext.create('Scrum.view.team.TaskLog', {
					title : 'Tasks',
					itemId : 'tasks',
					tabConfig : {
						itemId : 'task-log-tab'
					}
				}),*/
				Ext.create('Scrum.view.CommentPanel', {
					title : 'Comments',
					itemId : 'comments',
					commentableEntity : {
					 	url : '/comments/create',
					 	idField : 'user_id'
					}
				})
			]
		}	
	]
})