Ext.define('Scrum.view.sprint.SprintlogOverview', {
	extend : 'Ext.grid.Panel',
	xtype : 'scrum-sprintlog-overview', 
	title : 'Sprint Overview',
	cls : 'sprintlog-overview',
	
	forceFit : true,
	require : [
		'Scrum.view.sprint.form.AttachTeamForm',
		'Ext.grid.plugin.CellEditing',
		'Ext.grid.plugin.DragDrop'
	],
	tools : [
		{ type : 'plus', action : 'attach', tooltipType : 'title', tooltip : 'Attach userstory'},
		{ type : 'refresh', action : 'refresh', tooltipType : 'title', tooltip : 'Refresh overview'}
	],
	bbar : {
		xtype : 'pagingtoolbar',
		itemId : 'paging-toolbar',
		displayInfo: true,
        displayMsg: 'Displaying userstories {0} - {1} of {2}',
        emptyMsg: "No userstories to display",
	},
	getAvailableUserStoryStatuses : function(cellEditing, event){
		var activeEditor = event.column.getEditor();
		var userstoryStatus = event.value;

		activeEditor.store.clearFilter();
		activeEditor.store.filterBy(function(status){
			var userstoryStatus = event.value.value; 
			var status = parseInt(status.raw[0]);
			return Ext.data.Types.UserStoryStatus.isNeighbour(userstoryStatus, status);
		}, this);
	},
	onBeforeEdit : function(cellEditing, event){
		if (cellEditing.disabled)
			return false;

		if (event.field === 'status'){
			this.getAvailableUserStoryStatuses.apply(this, arguments);
			//fix : replace UserStoryStatus type object by value.display for valide view of cell edit
			event.value = event.value.display;
		}	
	},
	onValidateEdit : function(cellEditing, event){
		var value = parseInt(event.value);
		if (event.field === 'status'){
			event.value = Ext.data.Types.UserStoryStatus.getFromValue(value);
		}
	},
	onCancelEdit : function(cellEditing, event){
		if (event.field === 'status'){
			event.value = this.oldStatus;
		}
	},
	onCompleteEdit : function(cellEditing, event){
		this.fireEvent('onCompleteEditStatus', event.grid, 
			{ 
				record : event.record,
				oldStatus : event.originalValue,
			 	newStatus : event.value
			}
		);
	},
	initComponent : function(){
		var me = this;

		Ext.apply(this, {
			viewConfig : {
				emptyText : 'There are no userstories yet',
				plugins : {
					ptype : 'gridviewdragdrop',
					dragGroup : 'sprintlogGridDDGroup',
					dropGroup : 'backlogGridDDGroup',
					dragText : 'Drag and drop to detach from sprint'
				},
				listeners : {
					beforedrop : { fn : this.onBeforeUserStoryDrop, scope : this },
					drop : { fn : this.onAfterUserStoryDrop, scope : this}
				}
			},
			plugins : [
				{ 
					ptype : 'cellediting', 
					pluginId : 'cellediting',
					clicksToEdit : 1,
					listeners : {
						beforeedit : { 
							fn : this.onBeforeEdit, scope : this
						},
						validateedit : {
							fn : this.onValidateEdit, scope : this
						},
						edit : {
							fn : this.onCompleteEdit, scope : this
						}
					}
				}
			],
			columns : [
				{ 
					text : 'Name', dataIndex : 'name', 
					groupable : false
				},
				{ 
					text : 'Estimate',
					dataIndex : 'estimate',
					groupable : false
				},
				{ 
					text : 'Priority', dataIndex : 'priority',
					groupable : false,
					renderer : function(priority){
						return priority.display;
					}
				},
				{ 
					text : 'Status', dataIndex : 'status',
					groupable : false,
					renderer : function(status){
						return status.display;
					},
					editor : {
						xtype : "combobox",
						queryMode : 'local',
						typeAhead : true, 
						triggerAction : 'all',
						selectOnTab : true,
						store : Ext.data.Types.UserStoryStatus.getPairs(),
						valueField : 'value',
						displayField : 'display'
					}
				},
				{ 
					text : 'Update time', dataIndex : 'update_time',
					groupable : false,
					renderer : function(value){
						return Scrum.util.template.getPostDate(value);
					}
				},
				{
					text : 'Actions', 
					xtype : 'actioncolumn',
		            title : 'Actions',
		            iconCls : 'action-icon',
		            menuDisabled : true,
		            width : 100,
		            items : [
		            	{
		            		tooltip : 'Assign team', iconCls : 'icon-team',
		            		handler : function(view, rowIndex, colIndex, item, event, record){
		            			var attachTeamWin = Ext.create('Ext.window.Window', {
		            				height : 300,
		            				width : 600,
		            				title : 'Attach a team',
		            				modal : true,
		            				items : [
		            					Ext.create('Scrum.view.userstory.form.AttachTeamForm')
		            				]
		            			});

		            			attachTeamWin.show();
		            		}
		            	}
		            ]
				}
			]
		});

		this.callParent();
	}
})