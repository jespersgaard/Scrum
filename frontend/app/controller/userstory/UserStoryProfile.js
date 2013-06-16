Ext.define('Scrum.controller.userstory.UserStoryProfile', {
	id : 'UserStoryProfile',
	extend : 'Ext.app.Controller', 
	requires : [
		'Scrum.store.Comments'
	],
	views : ['userstory.Backlog'],
	models : ['UserStory'],
	//stores : ['Comments'],
	getCommentsStore : function(storeId){
		return Ext.StoreManager.lookup('UserstoryComments');
	},
	init : function(){
		Ext.StoreManager.register(Ext.create('Scrum.store.Comments', {
			storeId : 'UserstoryComments'
		}));

		this.control({
			'scrum-backlog' : {
				//viewUserStoryProfile : { fn : this.drawUserStoryProfile, scope : this },
				render : { fn : this.setComponents ,  scope : this}
			},
			'scrum-userstory-card tool[action=refresh]' : {
				click : { fn : this.onRefreshProfileClick, scope : this}
			},
			'scrum-userstory-card tool[action=edit]' : {
				click : { fn : this.showUserStoryEditForm , scope : this}
			},
			'scrum-userstory-edit-form button[action=submit]' : {
				click : { fn : this.submitUserstoryEditForm, scope : this}
			},
			'scrum-userstory-edit-form tool[action=close]' : {
				click : { fn : this.closeUserStoryForm, scope : this}
			},
			'scrum-backlog scrum-userstory-card' : {
				activate : { fn : this.drawUserStoryProfile, scope : this}
			},
			'scrum-backlog scrum-commentpanel'  : {
				activate : { fn : this.startDrawComments, scope : this}
			},
			'scrum-backlog scrum-commentpanel button[action=submit]' : {
				click : { fn : this.submitCommentForm , scope : this}
			}
		});
	},
	setComponents : function(backlog){
		this.backlog = backlog;
		this.userstoryCard = backlog.down('scrum-userstory-card');
		this.commentPanel = backlog.down('scrum-commentpanel');
	},
	setUserstory : function(userstory){
		this.userstory = userstory;
	},
	closeUserStoryForm : function(){
		this.userstoryCard.layout.setActiveItem('scrum-userstory-profile');
	},
	onRefreshProfileClick : function(){
		var userstory = this.getModel('UserStory');
		var profile = this.userstoryCard.down('#scrum-userstory-profile');

		profile.setLoading({ msg : 'Loading...'});
		Scrum.model.UserStory.load(this.userstory.get('id'), {
			url : '/userstories/get',
			success : function(record, op){
				this.userstory.set(record.getData());
				profile.setLoading(false);
				this.drawUserStoryProfile();
			},
			scope : this
		})
	},
	showUserStoryEditForm : function(){
		var card = this.userstoryCard;
		var rightTabPanel = this.backlog.down('tabpanel');
		var profileTab = rightTabPanel.down('header').down('#profile-tab');
		var form = card.layout.setActiveItem('scrum-userstory-edit-form');
		var priorityCombobox = form.down('scrum-userstory-priority-combobox');

		form.getForm().reset();
		form.down('hiddenfield[name=id]').setRawValue(this.userstory.get('id'));
		form.down('statusbar').hide();
		profileTab.setText('Edit');
		form.loadRecord(this.userstory);
		priority = this.userstory.get('priority');
		//fix: invalid priority display on form show
		priorityCombobox.select(priority.value);
	},
	submitUserstoryEditForm : function(button){
		var backlog = this.backlog;
		var form = this.userstoryCard.down('scrum-userstory-edit-form').getForm();

		if (form.isValid()){
			form.owner.setLoading({ msg : 'Please wait...'});
			form.submit({
				scope : this,
				success : function(form, action){
					var id = action.result.userstory.id;
					var updateTime = action.result.userstory.update_time;
					var userstory = this.userstory;
					var values = form.getValues();

					values['update_time'] = updateTime;
					userstory.set(values);
				
					form.owner.setLoading(false);
					this.drawUserStoryProfile();				
				}
			})
		}
		else {
			form.owner.onInvalidFields();
		}
	},
	drawUserStoryProfile : function(card){
		if (!card)
			card = this.userstoryCard;

		card.layout.setActiveItem('scrum-userstory-profile');
		card.down('panel').update(this.userstory.getData());
	},
	drawComments : function(comments, options){
		var userstory = this.userstory;
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
			params : { userstory_id : userstory.get('id')},
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
		commentForm.down('hiddenfield[name=userstory_id]').setRawValue(this.userstory.get('id'));
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
});