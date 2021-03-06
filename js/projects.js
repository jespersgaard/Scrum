$(document).ready(function(){
	var viewBehaviour = new ProjectsBehaviour();
	var models = {	
				'counters.projects.live' : new Counter({},{  name : 'counters.projects.live', url : '/project/get?live=1&count=1'}),
				'counters.projects.favorite' : new Counter({},{ name: 'counters.projects.favorite', url :'/project/get?favorite=1&count=1' }),
				'counters.projects.trashed' : new Counter({},{  name: 'counters.projects.trashed', url : '/project/get?trashed=1&count=1'}),
				'projects.live' : new Collection([], { name: 'projects.live', url : '/project/get?live=1&data=1'}),
				'projects.favorite' : new Collection([], { name:'projects.favorite', url : '/project/get?favorite=1&data=1'}),
				'projects.trashed' : new Collection([], { name:'projects.trashed', url : '/project/get?trashed=1&data=1'})
			};
	var views = {
		'projects.groups' : new GroupsPanel(),
		'projects.live' : new LiveProjectsTableView(),
		'projects.favorite' : new FavoriteProjectsTableView(),
		'projects.trashed' : new TrashedProjectsTableView(),
	};
	var favoriteProjects = models['projects.favorite'];
	router = new ProjectsRouter({models : models, views : views});
	viewBehaviour.bindModelsAndViews(models, views);
	viewBehaviour.bindRoutersAndViews({'projects' : router}, views);

	models['counters.projects.live'].fetch();
	models['counters.projects.trashed'].fetch();

	favoriteProjects.fetch({ reset : true}).success(function(){
		router.navigate('#/project/startup/favorite');
	});

	$(document).on('click', '.read-more-string', function(){
		$(this).next('.hide').show();
		$(this).hide();
		$(this).siblings('.hide-string').show();
	});

	$(document).on('click', '.hide-string',function(){
		$(this).hide();
		$(this).prev('.hide').hide();
		$(this).siblings('.read-more-string').show();
	});
});