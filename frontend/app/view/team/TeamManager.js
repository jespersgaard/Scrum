Ext.define('Scrum.view.team.TeamManager', {
	extend : 'Ext.panel.Panel',
	xtype : 'scrum-team-manager',
	requires : [
		'Scrum.view.team.Grid',
		'Scrum.view.team.RightPart'
	],
	layout : {
		align : 'stretch',
		type : 'hbox'
	},

	initComponent : function(){
		var me = this;

		Ext.applyIf(me, {
			items : [
				{ xtype : 'scrum-team-grid' , flex : 1 },
				{ xtype : 'scrum-team-right-part', flex : 1 }
			]
		});
		me.callParent();
	}
})