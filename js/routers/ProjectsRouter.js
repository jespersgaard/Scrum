ProjectsRouter = Backbone.Router.extend({
	initialize : function(options){
		options = options || {};
		this.models = (options.models)? options.models : [];
		this.views = (options.views)? options.views : [];
		Backbone.history.start();
		this.on('route', this.afterRoute, this);
	},
	routes : {
		'project/startup/:group' : 'startup',
		'project/change/:group' : 'switchToGroup',
		'project/changeGroup?fromGroup=:fromGroup&toGroup=:toGroup&action=:action&id=:id' : 'changeGroup',
		'project/refresh' : 'refresh',
		'project/:group/edit/:id' : 'edit',
		
		'project/create' : 'create'
	},
	startup : function(group){
		var newCollection = this.models['projects.' + group];
		var newTableview = this.views['projects.' + group];

		this.currentCollection = newCollection;
		this.currentTableview = newTableview;
		
		newTableview.show();
		//newTableview.listenTo(newCollection, 'add', newTableview.onAdd);
	},
	refresh : function(){
		this.currentCollection.fetch({ reset : true});
	},
	switchToGroup : function(group){
		var newTableview = this.views['projects.' + group];
		var newCollection = this.models['projects.' + group];
		var oldTableView = this.currentTableview;
		var oldCollection = this.currentCollection;

		if (oldTableView){
			oldTableView.hide();
			//oldTableView.stopListening(oldCollection, 'add');
		}
		this.currentCollection = newCollection;
		this.currentTableview = newTableview;

		newCollection.fetch({ reset : true }).done(function(){
			newTableview.show();
			//newTableview.listenTo(newCollection, 'add', newTableview.onAdd)	
		});
		this.trigger('switch', oldCollection.name, newCollection.name);
	},
	/*change group section*/
	changeGroup : function(fromGroup,toGroup,action,id){
		if (action === 'restore'){
			this.restore(id);
		}
		else {
			this.defaultChangeGroup(fromGroup, toGroup, action, id);		
		}
	},
	defaultChangeGroup : function(fromGroup, toGroup, action, id){
		var tableview;
		var fromGroup = this.models['projects.' + fromGroup];
		var toGroup = this.models['projects.' + toGroup];
		var project,checkedRows,ids;

		var _id = parseInt(id);

		if (_.isNumber(_id) && !_.isNaN(_id)){
			model = fromGroup.get(id);

			fromGroup.remove(model);
			$.ajax({ url:'/project/' + action, method:"POST", dataType:'json', data:{id:_id}}).success(function(resp){
				toGroup.add(resp, {parse:true});	
			}).fail(function(){
				Backbone.Events.trigger('error');
			});
		}
		else if (id === 'all'){
			tableview = this.currentTableview;
			checkedRows = tableview.where({ checked : true});
			ids = tableview.keys(checkedRows);
			models = _.map(ids, function(id, index){ return fromGroup.get(id)});

			fromGroup.remove(models);
			$.ajax({ url:'/project/' + action, method:"POST", dataType:'json', data:{ids:ids}}).success(function(resp){
				toGroup.add(resp, {parse : true});	
			}).fail(function(){
				Backbone.Events.trigger('error');
			});
		}
	},
	restore : function(id){
		var tableview;
		var trashed = this.models['projects.trashed'];
		var live = this.models['projects.live'];
		var favorite = this.models['projects.favorite'];

		var project,checkedRows,ids;

		var _id = parseInt(id);
		if (_.isNumber(_id) && !_.isNaN(_id)){
			model = trashed.get(id);

			trashed.remove(model);
			$.ajax({ url : '/project/restore', method:"POST", dataType:'json', data:{id:_id}}).success(function(resp){
				if (resp.data[0].favorite){
					favorite.add(resp, {parse:true});
				}
				else {
					live.add(resp, {parse:true});
				}
			}).fail(function(){
				Backbone.Events.trigger('error');
			});
		}
		else if (id === 'all'){
			tableview = this.currentTableview;
			checkedRows = tableview.where({ checked : true});
			ids = tableview.keys(checkedRows);
			models = _.map(ids, function(id, index){ return trashed.get(id)});

			trashed.remove(models);
			$.ajax({ url:'/project/restore', method:"POST", dataType:'json', data:{ids:ids}}).success(function(resp){
				toFavorite = _.filter(resp.data, function(record){ 
					return record.favorite === '1';
				});
				toLive = _.reject(resp.data, function(record){
					return record.favorite === '1'
				});

				live.add(toLive);
				favorite.add(toFavorite);	
			}).fail(function(){
				Backbone.Events.trigger('error');
			});
		}
	},
	create : function(){
		var liveProjects = this.models['projects.live'];
		var tableview = this.views['projects.tableview'];
		var popup = new PopupForm({ id : 'createPopup', title : 'Project Create', url : '/project/create'});

		popup.render();

		liveProjects.listenTo(popup, 'onAfterSubmit', function(resp){ 
			this.add(resp, {parse : true});
			this.stopListening(popup, 'onAfterSubmit');
		});
		liveProjects.listenTo(popup, 'onAfterHide', function(){
			this.stopListening(popup, 'onAfterHide');
		});
	},
	edit : function(group, id){
		var tableview = this.views['projects.' + group];
		var projects = this.models['projects.' + group], project;
		var popup = new PopupForm({  id : 'editPopup', title : "Project Edit", url : '/project/edit/' + id});
		popup.url = '/project/update?id=' + id;
		popup.render();
		projects.listenTo(popup, 'onAfterSubmit', function(resp){
			this.set(resp, { merge : true, parse:true, add : false, remove:false});
			project = projects.get(resp.data[0].id);
			tableview.update(project);

			projects.stopListening(popup, 'onAfterSubmit');
		});
		this.listenTo(popup, 'onAfterHide', function(){
			projects.stopListening(popup, 'onAfterHide');
		});
	},	
	afterRoute : function(router, route, params){
		this.navigate('',{replace:true});
	}
})