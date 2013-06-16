Ext.define('Scrum.controller.team.TeamManager', {
	extend : 'Ext.app.Controller',

	views : [
		'team.TeamManager'
	],
	init : function(){
		this.teamStore = Ext.create('Scrum.store.Users', {
			storeId : 'team'
		});

		Ext.StoreManager.register(this.teamStore);
		this.control({
			'scrum-team-manager' : {
				viewTeamManager : {
					fn : function(project){
						if (project instanceof Scrum.model.Project){
							this.project = project;
							this.getController('team.UserProfile').setProject(project);
						}
							
						this.drawGrid(this.teamGrid, this.getTeamStore());
					},
					scope : this
				},
				render : { fn : this.setComponents, scope : this}
			},
			'scrum-team-manager scrum-team-card' : {
				activate : { fn : function(card){
					this.activeTab = card;
				}}
			},
			'scrum-team-manager scrum-commentpanel' : {
				activate : { fn : function(commentPanel){
					this.activeTab = commentPanel;
				}}
			},
			'scrum-team-grid' : {
				itemclick : { fn : this.showUserProfile, scope : this}
			},
			'scrum-team-grid tool[action=refresh]' : {
				click : { fn : this.onRefreshTeamGrid, scope : this}
			}
			/*'scrum-team-grid tool[action=invite]' : {
				click : { fn : this.onInviteMemberClick, scope : this}
			}*/
		});
	},

	getTeamStore : function(){
		if (!this.teamStore){
			this.teamStore = Ext.StoreManager.lookup('team');
		}

		return this.teamStore;
	},

	setComponents : function(teamManager){
		var teamStore = this.getTeamStore();

		this.teamManager = teamManager;
		this.teamGrid = teamManager.down('scrum-team-grid');
		this.rightPart = teamManager.down('scrum-team-right-part');
		this.commentPanel = teamManager.down('scrum-comment-panel');
		this.profile = teamManager.down('#profile');

		teamStore.addListener('beforeload', function(store){
			store.proxy.extraParams = { project_id : this.project.get('id')};
		}, this);
		teamStore.addListener('load', this.onLoadTeam, this);
		this.teamGrid.reconfigure(teamStore);
	},

	onLoadTeam : function(store){
		if (store.count()){
			this.teamGrid.fireEvent('itemclick', this.teamGrid, store.getAt(0));
		}
	},

	showUserProfile : function(grid, user){
		var teamManager = this.teamManager;
		var rightPart = this.rightPart;
		var tabPanel = rightPart.down('#scrum-team-tab-panel');
		var profileTab;
		var profile, comments;

		rightPart.layout.setActiveItem(tabPanel);
		tabPanel.layout.setActiveItem('empty-panel');

		if (user instanceof Scrum.model.User)
			this.getController('team.UserProfile').setUser(user);

		if (!this.activeTab || this.activeTab.itemId == 'profile'){
			tabPanel.layout.setActiveItem('profile');

			profileTab = tabPanel.down('header').down('#profile-tab');
			profileTab.setText('Profile');
		}
		else if (this.activeTab.itemId == 'comments'){
			comments = tabPanel.layout.setActiveItem('comments');
		}
	},

	/*showInviteForm : function(button){

	},

	submitInviteForm : function(button){

	}*/

	onRefreshTeamGrid : function(tool){
		this.drawGrid(tool.up('grid'), this.getTeamStore(), { redraw : true});
	},

	drawGrid : function(grid, store, options){
		var partially, redraw;
		
		options = options || {};
        partially = options.partially;
        redraw = options.redraw;

		if (Ext.isEmpty(partially)){
			grid.setLoading({ msg : 'Refresh...'});
			if (redraw){
				store.reload({
					callback : function(){
						grid.setLoading(false);
					},
					scope : this
				})
			}
			else {
				store.load({
					callback : function(records){
						grid.setLoading(false);
					},
					scope : this
				})
			}
		}
		else {
			grid.reconfigure(store);
		}
	}
})