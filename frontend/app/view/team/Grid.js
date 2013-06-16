Ext.define('Scrum.view.team.Grid', {
	extend : 'Ext.grid.Panel',
	xtype : 'scrum-team-grid',
	forceFit : true,
	title : 'Team Overview',
	tools : [
		{ type : 'plus', action : 'invite', tooltipType : 'title', tooltip : 'Invite new member'},
		{ type : 'refresh', action : 'refresh',  tooltipType : 'title', tooltip : 'Refresh overview'}
	],
	initComponent : function(){
		Ext.apply(this, {
			columns : [
				{ 
					text : 'Firstname', dataIndex : 'firstname',
					groupable : false
				},
				{
					text : 'Lastname', dataIndex : 'lastname',
					groupable : false
				},
				{
					text : 'Last login', dataIndex : 'login_time',
					groupable : false,
					renderer : function(value){
						return Scrum.util.template.getPostDate(value);
					}
				}
			]
		});

		this.callParent();
	}
})