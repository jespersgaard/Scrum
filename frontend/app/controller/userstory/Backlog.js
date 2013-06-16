Ext.define('Scrum.controller.userstory.Backlog', {
	id : 'backlogController',
	extend : 'Ext.app.Controller', 
	views : ['userstory.Backlog'],
	models : ['UserStory'],
	getBacklogStore : function(){
		if (!this.backlogStore){
			this.backlogStore = Ext.StoreManager.lookup('backlogManager-backlog');
		}
		return this.backlogStore;
	},
	registerBacklogStore : function(){
		var backlogStore;

		this.backlogStore = backlogStore = Ext.create('Scrum.store.Userstories', {
			storeId : 'backlogManager-backlog'
		});

		this.backlogStore.addListener('beforeload', function(store, options){
		 	store.proxy.extraParams = { fromBacklog: true, project_id: this.project.get('id') };
		}, this);

		this.backlogStore.addListener('load', this.onLoadBacklog, this);
		Ext.StoreManager.register(backlogStore);
	},
	init : function(){
		this.registerBacklogStore();
		this.control({
			'scrum-backlog' : {
				viewBacklog : { fn : this.onViewBacklog, scope : this },
				render : { fn : this.setComponents ,  scope : this}
			},
			'scrum-backlog scrum-commentpanel' : {
				activate : { fn : function(commentPanel){
					this.activeTab = commentPanel;
				}, scope : this}
			},
			'scrum-backlog scrum-userstory-card' : {
				activate : { fn : function(card){
					this.activeTab = card;
				}, scope : this}
			},
			//bindings for backlog overview
			'scrum-userstory-backlog-overview' : {
				itemclick : { fn : this.showUserstoryProfile, scope : this},
				onCompleteEditStatus : { fn : this.changeUserStoryStatus, scope : this}
			}, 
			'scrum-userstory-create-form button[action=submit]' : {
				click : { fn : this.submitUserstoryCreateForm, scope : this}
			},
			'scrum-userstory-create-form tool[action=close]' : {
				click : { fn : function(){
					this.backlogGrid.fireEvent('itemclick', this.grid, this.displayedUserstory);
				}, scope : this}
			},
			'scrum-userstory-backlog-overview tool[action=create]' : {
				click : { fn : this.showUserstoryCreateForm , scope : this}
			},
			'scrum-userstory-backlog-overview tool[action=refresh]'	: {
				click : { fn : this.onRefreshBacklogGrid, scope : this }
			}
		});
	},
	setComponents : function(backlog){
		var backlogStore = this.getBacklogStore();

		this.backlog = backlog;
		this.backlogGrid = backlog.down('scrum-userstory-backlog-overview');

		this.createForm = backlog.down('scrum-userstory-create-form');
		this.rightPart = backlog.down('scrum-backlog-right-part');
		this.commentPanel = backlog.down('scrum-commentpanel');
		this.profile = backlog.down('#profile');

		this.backlogGrid.reconfigure(backlogStore);
	},
	//execute when we click on "Backlog" button 
	onViewBacklog : function(project){
		var backlogStore;

		if (project instanceof Scrum.model.Project){
			this.project = project;
		}
	
		this.drawGrid(this.backlogGrid, this.getBacklogStore());
	},
	onRefreshBacklogGrid : function(tool){
		this.drawGrid(tool.up('grid'), this.getBacklogStore(), { redraw : true});
	},
	showUserstoryCreateForm : function(){
		this.rightPart.layout.setActiveItem('empty-panel');
		var form = this.rightPart.layout.setActiveItem('scrum-userstory-create-form');
		var project = this.project;

		form.down('hiddenfield[name=project_id]').setRawValue(project.get('id'));
		form.down('statusbar').hide();
	},
	submitUserstoryCreateForm : function(button){
		var backlog = this.backlog;
		var project = this.project;
		var grid = this.backlogGrid;
		var form = this.createForm.getForm();
		var backlogStore = this.getBacklogStore();
		var statusBar = form.owner.down('statusbar');

		if (form.isValid()){
			form.owner.setLoading({ msg : 'Please wait...'});
			form.submit({
				scope : this,
				success : function(form, action){
					var userstory = Ext.create('Scrum.model.UserStory');
					var continueCreateCheckbox = form.owner.down('checkbox[action=continue_create]'); 
					var continueCreate;

					userstory.set(form.getValues());
					userstory.setId(action.result.userstory.id);
					userstory.set('update_time', action.result.userstory.update_time);
					userstory.set('status', action.result.userstory.status);
					backlogStore.add(userstory);			

					form.owner.setLoading(false);
					continueCreate = continueCreateCheckbox.getRawValue();
					form.reset();
					if (continueCreate){
						form.owner.onSuccessfulCreation(userstory);
						form.owner.down('hiddenfield[name=project_id]').setRawValue(project.get('id'));
						this.displayedUserstory = userstory;
					}
					else {
						statusBar.hide();
						grid.fireEvent('itemclick', grid, this.displayedUserstory = userstory);	
					}
					
					form.owner.down('checkbox[action=continue_create]').setRawValue(continueCreate);
				}
			})
		}
		else {
			form.owner.onInvalidFields();
		}
	},
	showUserstoryProfile : function(grid, userstory){
		var backlog = this.backlog;
		var rightPart = this.rightPart;
		var tabPanel = rightPart.down('#scrum-userstory-tabpanel');
		var profileTab;
		var profile, comments;

		rightPart.layout.setActiveItem('scrum-userstory-tabpanel');
		tabPanel.layout.setActiveItem('empty-panel');
		if (userstory instanceof Scrum.model.UserStory)
			this.getController('userstory.UserStoryProfile').setUserstory(userstory);

		if (!this.activeTab || this.activeTab.itemId == 'profile'){
			tabPanel.layout.setActiveItem('profile');	

			profileTab = tabPanel.down('header').down('#profile-tab');
			profileTab.setText('Profile');
		}
		else if (this.activeTab.itemId == 'comments'){
			comments = tabPanel.layout.setActiveItem('comments');
		}
	},
	changeUserStoryStatus : function(grid, event){
		var record = event.record;
		var oldStatus = event.oldStatus.value;
		var newStatus = event.newStatus.value;

		record.save({
			url : '/userstories/changeStatus',
			params : { id : record.get('id') , oldStatus: oldStatus, newStatus : newStatus}
		});
	},
	/*
	loadSprints : function(combobox){
		var store = this.getSprintsStore();
		if (store.count() === 0){
			combobox.setLoading({ msg : 'Loading...'});
			store.load({
				params : { project_id : this.project.get('id')},
				callback : function(){
					combobox.setLoading(false);
				}
			})
		}
	},*/
	drawGrid : function(grid, store, options){
		var paging;
		var partially,redraw;

		options = options || {};
		partially = options.partially;
		redraw = options.redraw;

		if (Ext.isEmpty(partially)){
			grid.setLoading({ msg : 'Refresh...'});
			if (redraw){
				store.reload({
					callback : function(records){
						grid.setLoading(false);
					},
					scope : this
				});	
			}
			else {
				paging = grid.getDockedComponent('paging-toolbar');
				paging.bind(store);	
				store.loadPage(1, {
					scope : this,
					callback : function(records, op){
						grid.setLoading(false);
					}
				});	
			}	
		}
		else {
			grid.reconfigure(store);
		}
	},
	onLoadBacklog : function(store){
		if (store.count()){
			this.displayedUserstory = store.getAt(0);
			this.backlogGrid.fireEvent('itemclick', this.backlogGrid, this.displayedUserstory);
		}
		else {
			this.showUserstoryCreateForm();
		}
	}
});