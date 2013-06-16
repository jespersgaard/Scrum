Ext.define('Scrum.controller.team.UserProfile', {
	id : 'UserProfile',
	extend : 'Ext.app.Controller', 
	requires : [
		'Scrum.store.Comments'
	],
	views : ['team.Grid'],
	models : ['User'],
	//stores : ['Comments'],
	getCommentsStore : function(storeId){
		return Ext.StoreManager.lookup('UserComments');
	},
	init : function(){
		Ext.StoreManager.register(Ext.create('Scrum.store.Comments', {
			storeId : 'UserComments'
		}));

		this.control({
			'scrum-team-manager' : {
				//viewUserStoryProfile : { fn : this.drawUserStoryProfile, scope : this },
				render : { fn : this.setComponents ,  scope : this}
			},
			'scrum-team-card tool[action=refresh]' : {
				click : { fn : this.onRefreshProfileClick, scope : this}
			},
			'scrum-team-manager scrum-team-card' : {
				activate : { fn : this.drawUserProfile, scope : this}
			},
			'scrum-team-manager scrum-commentpanel'  : {
				activate : { fn : this.startDrawComments, scope : this}
			},
			'scrum-team-manager scrum-commentpanel button[action=submit]' : {
				click : { fn : this.submitCommentForm , scope : this}
			}
		});
	},
	setComponents : function(teamManager){
		this.teamManager = teamManager;
		this.userCard = teamManager.down('scrum-team-card');
		this.commentPanel = teamManager.down('scrum-commentpanel');

		this.commentPanel.down('form').add({ xtype : 'hiddenfield', name : 'context_project_id'});
	},
	setUser : function(user){
		this.user = user;
	},
	setProject : function(project){
		this.project = project;
	},
	onRefreshProfileClick : function(){
		var user = this.getModel('User');
		var profile = this.userCard.down('#scrum-user-profile');

		profile.setLoading({ msg : 'Loading...'});
		Scrum.model.User.load(this.user.get('id'), {
			url : '/users/get',
			success : function(record, op){
				this.user.set(record.getData());
				profile.setLoading(false);
				this.drawUserStoryProfile();
			},
			scope : this
		})
	},
	drawUserProfile : function(card){
		if (!card)
			card = this.userCard;

		card.layout.setActiveItem('scrum-user-profile');
		card.down('panel').update(this.user.getData());
	},
	drawComments : function(comments, options){
		var user = this.user;
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
			params : { user_id : user.get('id'), context_project_id : this.project.get('id')},
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
		commentForm.down('hiddenfield[name=context_project_id]').setRawValue(this.project.get('id'));
		commentForm.down('hiddenfield[name=user_id]').setRawValue(this.user.get('id'));
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