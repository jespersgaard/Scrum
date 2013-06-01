Ext.define('Scrum.controller.TopPanel', {
	extend : 'Ext.app.Controller', 
	views : [
		'ProjectsDropdown'
	],
	stores : [
		'Projects'
	],
	models : [
		'Project'
	],
	init : function(){
		this.control({
			'scrum-contentpanel' : {
				render : { fn : this.setContentPanel, scope : this}
			},
			'scrum-toppanel' : {
				render : { fn : this.setToppanel, scope : this}
			},
			'scrum-projects-dropdown' : {
				render : { fn : this.renderDropdown, scope : this}
			},
			'scrum-projectprofile' : {
				activate : { fn : this.showProjectProfile, scope : this}
			},
			'scrum-backlog' : {
				activate : { fn : this.showBacklog, scope : this}
			},
			'scrum-sprint-manager' : {
				activate : { fn : this.showSprintManager , scope : this}
			},
			'scrum-projects-dropdown > menuitem[action=projectView]' : {
				click : { fn : this.onProjectClick, scope : this}
			},
			'scrum-projects-dropdown > menuitem[action=create]' : {
				click : { fn : this.showCreateForm, scope : this}
			},
			'scrum-toppanel button[action=backlog]' : {
				click : { fn : this.onBacklogClick, scope : this}
			},
			'scrum-project-create-form button[action=submit]'  : {
				click : { fn : this.submitProjectCreateForm , scope : this}
			},
			'scrum-toppanel button[action=sprints]' : {
				click : { fn : this.onSprintsClick, scope : this}
			},
			'scrum-account-dropdown > menuitem[action=logout]' : {
				click : { fn : this.Logout, scope : this}
			}
		});
	},
	setContentPanel : function(panel){
		this.contentPanel = panel;
	},
	setToppanel : function(toppanel){
		var projects = this.getStore('Projects');
		var menu = toppanel.down('menu');

		this.toppanel = toppanel;

		projects.addListener('add', function(store, records){
			var project = records[0];
			menu.add({ text : project.get('name'), action : 'projectView', projectId : project.get('id')})
		}, this);
	},
	renderDropdown : function(dropdown){
		var menu = dropdown.menu;
		var items = [];
		var projects = this.getStore('Projects');
		dropdown.setLoading({msg : 'Loading...'});

		projects.load({
			url : '/project/get?live=1',
			callback : function(records){
				var activeProjectId = Ext.state.Manager.getProvider().get('project-id');
				var activeProject = projects.getById(activeProjectId);
				var activeProjectItem;

				Ext.Array.each(records, function(record, index){
					if (record.get('id') !== activeProjectId){
						items.push({ 
							text : record.get('name'), 
							action : 'projectView',
							projectId : record.get('id')
						});	
					}
				}, this);	

				activeProjectItem = menu.add({ 
					text : activeProject.get('name'), 
					action : 'projectView', 
					projectId : activeProject.get('id')
				});
				menu.add(['-']);
				menu.add(items);
			
				dropdown.setLoading(false);	
				activeProjectItem.fireEvent('click', activeProjectItem);
			}, 
			scope : this});	
	},
	showCreateForm : function(){
		var form;

		if (!this.win){
			this.createProjectWindow = Ext.create('Ext.window.Window', {
				title: 'Create Project',
				closable: true,
	            closeAction: 'hide',
	            width: 600,
	            minWidth: 350,
	            height: 600,
	            items : [
	            	Ext.create('Scrum.view.project.form.CreateForm')
	            ],
	            listeners : {
	            	close : { fn : function(){
	            		this.contentPanel.show();
	            		this.toppanel.show();
	            	}, scope : this}
	            }
			});

			this.createProjectWindow.show();
		}

		this.createProjectWindow.show();
		form = this.createProjectWindow.down('form').getForm();
		form.reset();
		
		this.contentPanel.hide();
		this.toppanel.hide();
	},
	submitProjectCreateForm : function(button){
		var form = button.up('scrum-project-create-form').getForm();
		var projects = this.getProjectsStore();

		if (form.isValid()){
			form.owner.setLoading({ msg : 'Please wait...'});
			form.submit({
				scope : this,
				success : function(form, action){
					var id = action.result.project.id;
					var updateTime = action.result.project.update_time;
					var project = Ext.create('Scrum.model.Project');
					var values = form.getValues();

					values['update_time'] = updateTime;
					project.setId(action.result.project.id);
					project.set(values);
					projects.add(project);

					form.owner.setLoading(false);
					this.createProjectWindow.close();			
				}
			})
		}
		else {
			form.owner.onInvalidFields();
		}
	},
	onProjectClick : function(item){
		var projectId = item.projectId;
		var store = this.getProjectsStore();

		this.selectedProject = store.getById(projectId);
		this.contentPanel.layout.setActiveItem(0);
		this.contentPanel.layout.setActiveItem('project-profile');
	},
	onBacklogClick : function(){
		this.contentPanel.layout.setActiveItem(0);
		this.contentPanel.layout.setActiveItem('userstory-backlog');
	},
	onSprintsClick : function(){
		this.contentPanel.layout.setActiveItem(0);
		this.contentPanel.layout.setActiveItem('sprint-manager');	
	},
	showProjectProfile : function(profile){
		profile.fireEvent('viewProject', this.selectedProject);
	},
	showBacklog : function(backlog){
		backlog.fireEvent('viewBacklog', this.selectedProject);
	},
	showSprintManager : function(sprintManager){
		sprintManager.fireEvent('viewSprintManager', this.selectedProject);
	},
	Logout : function(){
		var conn = Ext.create('Ext.data.Connection');
		/**conn.request({
			url : '/auth/logout',
			success : function(){
				this.viewport.removeAll();
				this.viewport.showAuthGroup();
			}
		})*/
	}
})