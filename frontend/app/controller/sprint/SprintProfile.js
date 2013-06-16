Ext.define('Scrum.controller.sprint.SprintProfile', {
	extend: 'Ext.app.Controller',
	id : 'SprintProfile',
	requires : [
		'Scrum.store.Comments'
	],
    views: [
        'sprint.SprintManager'
    ],
    models : ['Sprint','SprintSummary'],
    getCommentsStore : function(){
		return Ext.StoreManager.lookup('SprintComments');
	},
	getBurndownStatisticsStore : function(){
		return Ext.StoreManager.lookup('BurndownStatistic');
	},
	getSprintlogStore : function(){
		return Ext.StoreManager.lookup('SprintUserstories');
	},
	getBacklogStore : function(){
		return Ext.StoreManager.lookup('sprintManager-backlog');
	},
	registerBacklogStore : function(){
		var backlogStore;

		backlogStore = Ext.create('Scrum.store.Userstories', {
			storeId : 'sprintManager-backlog'
		});

		backlogStore.addListener('beforeload', function(store, options){
		 	store.proxy.extraParams = { fromBacklog: true, project_id: this.project.get('id') };
		}, this);

		Ext.StoreManager.register(backlogStore);
	},
	registerSprintlogStore : function(){
		Ext.StoreManager.register(sprintlogStore = Ext.create('Scrum.store.Userstories', {
			storeId : 'SprintUserstories'
		}));

		sprintlogStore.addListener('beforeload', function(store, options){
			store.proxy.extraParams = { sprint_id : this.sprint.get('id') };
		}, this);
	},
	registerBurndownStatisticStore : function(){
		Ext.StoreManager.register(Ext.create('Scrum.store.sprint.BurndownStatistic',{
    		storeId : 'BurndownStatistic'
    	}));
	},	
	registerCommentsStore : function(){
		Ext.StoreManager.register(Ext.create('Scrum.store.Comments', {
			storeId : 'SprintComments'
		}));	
	},
    init : function(){
    	this.registerBacklogStore();
    	this.registerBurndownStatisticStore();
    	this.registerCommentsStore();
    	this.registerSprintlogStore();
		this.control({
			'scrum-sprint-manager' : {
				render : { fn : this.setComponents ,  scope : this},
				viewSprintManager : { fn : this.onViewSprintManager, scope : this}
			},
			'scrum-sprint-card tool[action=refresh]' : {
				click : { fn : this.onRefreshProfileClick, scope : this}
			},
			'scrum-sprint-card tool[action=edit]' : {
				click : { fn : this.showSprintEditForm , scope : this}
			},
			'scrum-sprint-edit-form button[action=submit]' : {
				click : { fn : this.submitSprintForm, scope : this}
			},
			'scrum-sprint-edit-form tool[action=close]' : {
				click : { fn : this.closeSprintForm, scope : this}
			},
			'scrum-sprint-manager scrum-sprint-card' : {
				activate : { fn : this.drawSprintProfile, scope : this}
			},

			'scrum-sprint-manager #plan' : {
				activate : { fn : this.drawSprintlogGrid, scope : this}
			},
			'scrum-sprintlog-overview' : {
				onCompleteEditStatus : { fn : this.changeUserStoryStatus, scope : this}
			},
			'scrum-sprintlog-overview tool[action=attach]' : {
				click : { fn : this.drawBacklogGrid, scope : this}
			},
			'scrum-sprintlog-overview tool[action=refresh]' : {
				click : { fn : this.onRefreshSprintlogClick, scope : this}
			},
			'scrum-sprintlog-overview gridview' : {
				beforedrop : { fn : this.onBeforeUserStoryAttachToSprint, scope : this},
				drop : { fn : this.onAfterUserStoryAttachToSprint, scope : this},
			},
			'scrum-sprint-backlog-overview' : {
				onCompleteEditStatus : { fn : this.changeUserStoryStatus, scope : this}
			},
			'scrum-sprint-backlog-overview tool[action=refresh]' : {
				click : { fn : this.onRefreshBacklogClick, scope : this}
			},
			'scrum-sprint-backlog-overview gridview' : {
				beforedrop : { fn : this.onBeforeUserStoryDetachFromSprint, scope : this},
				drop : { fn : this.onAfterUserStoryDetachFromSprint, scope : this}
				//detachFromSprint : { fn : this.detachFromSprint, scope : this}
			},

			'scrum-sprint-manager scrum-commentpanel'  : {
				activate : { fn : this.startDrawComments, scope : this}
			},
			'scrum-sprint-manager scrum-sprint-summary' : {
				activate : { fn : this.drawSprintSummary, scope : this}
			},
			'scrum-sprint-manager #burndown' : {
				activate : { fn : this.drawSprintBurndown, scope : this}
			},
			'scrum-sprint-manager scrum-commentpanel button[action=submit]' : {
				click : { fn : this.submitCommentForm , scope : this}
			}
		});
    },
    setComponents : function(sprintManager){
    	var sprintlogStore = this.getSprintlogStore();

    	this.sprintManager = sprintManager;
		this.sprintCard = sprintManager.down('scrum-sprint-card');
		this.sprintlogGrid = sprintManager.down('scrum-sprintlog-overview');
		this.sprintSummaryPanel = sprintManager.down('scrum-sprint-summary');
		this.commentPanel = sprintManager.down('scrum-commentpanel');
		this.burndownChart = this.sprintManager.down('scrum-sprint-burndown-chart');

		this.burndownChart.bindStore(this.getBurndownStatisticsStore());
		this.sprintlogGrid.reconfigure(sprintlogStore);
    },
    setSprint : function(sprint){
		this.sprint = sprint;
	},
	closeSprintForm : function(){
		this.sprintCard.layout.setActiveItem('scrum-sprint-profile');
	},
	onViewSprintManager : function(project){
		if (project instanceof Scrum.model.Project){
            this.project = project;
        }
	},
	onRefreshProfileClick : function(){
		var sprint = this.getModel('Sprint');
		var profile = this.sprintCard.down('#scrum-sprint-profile');

		profile.setLoading({ msg : 'Loading...'});
		Scrum.model.Sprint.load(this.sprint.get('id'), {
			url : '/sprints/get',
			success : function(record, op){
				this.sprint.set(record.getData());
				profile.setLoading(false);
				this.drawSprintProfile();
			},
			scope : this
		})
	},
	onRefreshBacklogClick : function(button){
		var grid = button.up('grid');
		var store = this.getBacklogStore();

		grid.setLoading({ msg : 'Loading...'});
		store.reload({
			callback : function(){
				grid.setLoading(false);
			}
		})
	},
	onRefreshSprintlogClick : function(){
		var store = this.getSprintlogStore();

		this.sprintlogGrid.setLoading({ msg : "Loading..."});
		store.reload({
			callback : function(){
				this.sprintlogGrid.setLoading(false);
			}
		})
	},
	showSprintEditForm : function(){
		var card = this.sprintCard;
		var rightTabPanel = this.sprintManager.down('tabpanel');
		var profileTab = rightTabPanel.down('header').down('#profile-tab');
		var form = card.layout.setActiveItem('scrum-sprint-edit-form');

		form.getForm().reset();
		form.down('hiddenfield[name=id]').setRawValue(this.sprint.get('id'));
		form.down('statusbar').hide();
		profileTab.setText('Edit');
		form.loadRecord(this.sprint); 
	},
	submitSprintForm : function(button){
		var sprintManager = this.sprintManager;
		var form = this.sprintCard.down('scrum-sprint-edit-form').getForm();

		if (form.isValid()){
			form.owner.setLoading({ msg : 'Please wait...'});
			form.submit({
				scope : this,
				success : function(form, action){
					var id = action.result.sprint.id;
					var updateTime = action.result.sprint.update_time;
					var sprint = this.sprint;
					var values = form.getValues();

					values['update_time'] = updateTime;
					sprint.set(values);
				
					form.owner.setLoading(false);
					this.drawSprintProfile();				
				}
			})
		}
		else {
			form.owner.onInvalidFields();
		}
	},
	drawSprintProfile : function(card){
		if (!card)
			card = this.sprintCard;

		card.layout.setActiveItem('scrum-sprint-profile');
		card.down('panel').update(this.sprint.getData());
	},
	drawSprintlogGrid : function(panel, options){
		var store = this.getSprintlogStore();
		var grid = panel.down('scrum-sprintlog-overview');
		var sprintStatus = this.sprint.get('status').value;

		if (sprintStatus !== Ext.data.Types.SprintStatus.PLANNED){
			grid.down('tool[action=attach]').hide();
		}
		else {
			grid.down('tool[action=attach]').show();
		}

		if (sprintStatus === Ext.data.Types.SprintStatus.CURRENT){
			grid.getPlugin('cellediting').enable();
		}
		else {
			grid.getPlugin('cellediting').disable();
		}

		paging = grid.getDockedComponent('paging-toolbar');
		paging.bind(store);	
		store.loadPage(1, {
			scope : this,
			callback : function(records, op){
				grid.setLoading(false);
			}
		});
	},
	drawBacklogGrid : function(){
		var store = this.getBacklogStore();
		var backlogOverview;

		if (!this.backlogGridWin){
			this.backlogGridWin = Ext.create('Ext.window.Window', {
				title : "Backlog",
				closeAction : 'hide',
				width : 600,
				height : 300,
				layout : 'fit',
				items : [
					backlogOverview = Ext.create('Scrum.view.sprint.BacklogOverview')
				]
			});
			backlogOverview.reconfigure(store);
			backlogOverview.addListener('render', function(grid){
				var store = this.getBacklogStore();

				paging = grid.getDockedComponent('paging-toolbar');
				paging.bind(store);
				store.loadPage(1, {
					scope : this,
					callback : function(records, op){
						grid.setLoading(false);
					}
				})
			}, this);
		};
		this.backlogGridWin.show();
	},	
	drawSprintSummary : function(summary){
		var sprint = this.sprint;
		var sprintSummary = this.getSprintSummaryModel();
		var sprintSummaryPanel = this.sprintSummaryPanel;

		sprintSummary.load(sprint.get('id'),{
			callback : function(record){
				sprintSummaryPanel.fill(record);	
			}
		});
	},
	drawSprintBurndown : function(){
		var sprint = this.sprint;
		var burndownStatistic = this.getBurndownStatisticsStore();

		burndownStatistic.load({
			params : { id : sprint.get('id')},
			callback : function(records, op){
				this.burndownChart.redraw();
			},
			scope : this
		})
	},
	drawComments : function(comments, options){
		var sprint = this.sprint;
		var commentsList = this.commentPanel.down('dataview');
		var fn;

		if (options && options.redraw){
			fn = 'reload';
		}
		else {
			commentsList.bindStore(comments);	
			fn = 'load';
		}

		comments[fn].apply(comments, [{
			params : { sprint_id : sprint.get('id')},
			callback : function(records){
				comments.sort({ property : 'post_date', direction : 'DESC'});
				commentsList.refresh();		
			},
			scope : this
		}]);
	},
	startDrawComments : function(commentPanel){
		var comments = this.getCommentsStore();
		var commentForm = this.commentPanel.down('form');
		var commentScopeId;
		var options;

		if (comments.lastOptions && comments.lastOptions.params){
			options = { redraw : true};
		}
	
		commentForm.down('hiddenfield[name=author_id]').setRawValue(Ext.state.Manager.getProvider().get('user-id'));
		commentForm.down('hiddenfield[name=sprint_id]').setRawValue(this.sprint.get('id'));
		this.drawComments(comments, options);
	},
	submitCommentForm : function(button){
		var commentPanel = button.up('scrum-commentpanel');
		var form = button.up('form').getForm();
		var comments = this.getCommentsStore();
		var stateProvider = Ext.state.Manager.getProvider();

		if (form.isValid()){
			form.owner.setLoading({msg : 'Please wait...'});
			form.submit({
				success : function(form, action){
					var commentsList = commentPanel.down('dataview');
					var id = action.result.comment.id;
					var post_date = action.result.comment.post_date;

					var comment = Ext.create('Scrum.model.Comment', {
						id : id,
						author : stateProvider.get('firstname') + ' ' + stateProvider.get('lastname'),
						content : form.owner.down('textarea[name=content]').getRawValue(),
						post_date : post_date
					});
					
					comments.add(comment);
					commentsList.refresh();

					form.owner.down('textarea[name=content]').reset();
					form.owner.setLoading(false);
				},
				failure : function(){
					console.log('comment adding error');
				},
				scope : this
			})
		}
	},
	onBeforeUserStoryDetachFromSprint : function(node, data, overModel){	
		var draggedModel = data.records[0];
		var sprint = this.sprint;

		if ((Ext.isEmpty(overModel) || !overModel.get('sprint')) &&  
			sprint.get('status').value === Ext.data.Types.SprintStatus.PLANNED){
			return true;
		}

		return false;
	},
	
	onBeforeUserStoryAttachToSprint : function(node, data, overModel, dropPosition, dropHandlers){
		var draggedModel = data.records[0];
		var sprint = this.sprint;

		var userstoryStatus = draggedModel.get('status').value;
		var sprintStatus = sprint.get('status').value;

		if (userstoryStatus === Ext.data.Types.UserStoryStatus.OPEN)
			return false;

		if ((sprintStatus === Ext.data.Types.SprintStatus.COMPLETED) || (sprintStatus === Ext.data.Types.SprintStatus.CURRENT))
			return false;
		
		if ((Ext.isEmpty(overModel) || overModel.get('sprint')) && !draggedModel.get('sprint')){
			return true;
		}

		return false;
	},
	onAfterUserStoryDetachFromSprint : function(node, data, overModel){
		var draggedModel = data.records[0];

		this.detachFromSprint(draggedModel);
	},
	onAfterUserStoryAttachToSprint : function(node, data, overModel){
		var draggedModel = data.records[0];

		this.attachToSprint(draggedModel);
	},
	attachToSprint : function(model){
		var result;
		model.save({
			url : '/userstories/changeSprint', 
			params : { id: model.get('id'), sprint_id : this.sprint.get('id') },
			scope : this,
			callback : function(record, op, success){
				var backlogStore = this.getBacklogStore();

				if (success){
					backlogStore.remove(model);	
				}
				else {
					return false;
				}
			}
		})
	},
	detachFromSprint : function(model){
		model.save({
			url : '/userstories/changeSprint',
			params : { id : model.get('id'), detach : true},
			scope : this,
			callback : function(record, op){
				var sprintlogStore = this.getSprintlogStore();
				var backlogStore = this.getBacklogStore();
				model.set('sprint', null);

				sprintlogStore.remove(model);
			}
		})
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
});