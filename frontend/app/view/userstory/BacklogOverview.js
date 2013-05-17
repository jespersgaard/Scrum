Ext.define('Scrum.view.userstory.BacklogOverview', {
	extend : 'Ext.grid.Panel',
	xtype : 'scrum-userstory-backlog-overview', 
	forceFit : true,
	require : [
		'Ext.form.field.ComboBox',
		'Ext.grid.plugin.CellEditing',
		'Scrum.store.UserStoryStatuses'
	],
	title : 'Backlog Overview',
	tools : [
		{ type : 'plus', action : 'create', tooltipType : 'title', tooltip : 'Add new userstory'},
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
			return Ext.data.Types.USER_STORY_STATUS.isNeighbour(userstoryStatus, status);
		}, this);
	},
	onBeforeUserStoryDrop : function(node, data, overModel){
		var sprint; 
		var draggedModel = data.records[0];

		data.view.fireEvent('detachFromSprint', draggedModel);
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
			event.value = Ext.data.Types.USER_STORY_STATUS.getFromValue(value);
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
		Ext.apply(this, {
			viewConfig : {
				plugins : [
					{
	            		ptype: 'gridviewdragdrop',
	            		dragText: 'Drag and drop to reorganize'
	        		}
				],
				listeners : {
					beforedrop : { fn : this.onBeforeUserStoryDrop , scope : this}
				}
			},
			plugins : 
				[
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
					renderer : function(value){
						return Scrum.util.template.getPriorityDisplayValue(value);
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
						queryModel : 'local',
						typeAhead : true, 
						triggerAction : 'all',
						selectOnTab : true,
						store : Ext.data.Types.USER_STORY_STATUS.getPairs(),
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