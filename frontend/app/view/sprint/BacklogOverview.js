Ext.define('Scrum.view.sprint.BacklogOverview', {
	extend : 'Ext.grid.Panel',
	xtype : 'scrum-sprint-backlog-overview', 
	forceFit : true,
	require : [
		'Scrum.store.UserStoryStatuses',
		'Ext.grid.plugin.DragDrop'
	],
	title : 'Backlog Overview',
	tools : [
		{ type : 'refresh', action : 'refresh', tooltipType : 'title', tooltip : 'Refresh overview'}
	],
	bbar : {
		xtype : 'pagingtoolbar',
		itemId : 'paging-toolbar',
		displayInfo: true,
        displayMsg: 'Displaying userstories {0} - {1} of {2}',
        emptyMsg: "No userstories to display"
	},
	
	onBeforeEdit : function(cellEditing, event){
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
	initComponent : function(){
		Ext.apply(this, {
			viewConfig : {
				plugins : {
					ptype : 'gridviewdragdrop',
					dropGroup : 'sprintlogGridDDGroup',
					dragGroup : 'backlogGridDDGroup',
					dragText : 'Drag and drop to attach to sprint'
				},
				listeners : {
					drop : { fn : this.onAfterUserStoryDrop, scope : this},
					beforedrop : { fn : this.onBeforeUserStoryDrop, scope : this}
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
				}
			]
		});

		this.callParent();
	}
})