Ext.define('Scrum.view.team.Card', {
	extend : "Ext.panel.Panel",
	xtype : 'scrum-team-card',
	layout : 'card',
	bodyCls : 'userstory-card', 
	items :  [
		Ext.create('Ext.panel.Panel', { 
			itemId : 'scrum-user-profile',
			overflowY : 'scroll',
			header : {
				titleAlign : 'right',
				tooltipType : 'title',
				items : [
					{ type : 'refresh', title : 'Refresh Profile', action : 'refresh'}
				]
			},
			tpl : new Ext.XTemplate(
				'<span class="update-time">Login time - {[this.formatPostDate(values.login_time)]}</span>' + 
				'<h2>{lastname} {firstname}</h2>' + 
				'<div>' + 
					'<img class="avatar" width="64" height="64" src="http://www.gravatar.com/avatar/3dea782e580e0d4b8c733e4ec2d3a9c7?s=64&amp;r=PG&amp;d=identicon">' + 
					'<div>{description}</div>' + 
				'</div>', {
				formatPostDate : function(date){
					return Scrum.util.template.getPostDate(date);
				}
			})
		})
	]
});