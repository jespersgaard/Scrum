Ext.define('Scrum.view.userstory.SprintlogOverview', {
	extend : 'Ext.grid.Panel',
	xtype : 'scrum-userstory-sprintlog-overview', 
	title : 'Sprint Overview',
	forceFit : true,
	require : [
		'Scrum.view.userstory.form.AttachTeamForm',
		'Ext.grid.plugin.CellEditing',
		'Ext.grid.plugin.DragDrop'
	],
	tools : [
		{ type : 'refresh', action : 'refresh', tooltipType : 'title', tooltip : 'Refresh overview'}
	],
	
	bbar : {
		xtype : 'pagingtoolbar',
		itemId : 'paging-toolbar',
		displayInfo: true,
        displayMsg: 'Displaying userstories {0} - {1} of {2}',
        emptyMsg: "No userstories to display",
	},
	onBeforeUserStoryDrop : function(node, data, overModel, dropPosition, dropHandlers){
		var draggedModel = data.records[0];
		var sprintSelect = this.down('combobox');
		var activeSprintName = sprintSelect.getRawValue();
		var activeSprint = sprintSelect.findRecordByDisplay(activeSprintName);
		var activeSprintStatus = activeSprint.get('status').value;

		var status = draggedModel.get('status');
		var result;

		if (status.value === Ext.data.Types.UserStoryStatus.OPEN)
			return false;
		if ((activeSprintStatus === Ext.data.Types.SprintStatus.COMPLETED) || (activeSprintStatus === Ext.data.Types.SprintStatus.CURRENT))
			return false;

		if (Ext.isEmpty(sprintSelect.getRawValue()))
			return false;
		
		if ((Ext.isEmpty(overModel) || overModel.get('sprint')) && !draggedModel.get('sprint')){
			return result;
		}

		return false;
	},
	onAfterUserStoryDrop : function(node, data, overModel){
		var draggedModel = data.records[0];
		var fn;
		var result;

		this.view.fireEvent('attachToSprint', draggedModel);
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
			tbar : {
				items : [
					{ 
						xtype : 'combobox' ,
						action : 'get_sprints',
						displayField : 'name',
						valueField : 'id', 
						queryMode : 'local',
						listConfig : {
							tpl : new Ext.XTemplate('<tpl for="."><div class="x-boundlist-item">{name} <tpl if="this.isActive(status)">' + 
							'<span class="combobox-item-sprint-status"><b> Active</b></span> ' + 
                			'<tpl elseif="this.isCompleted(status)"><span class="combobox-item-sprint-status"><b> Completed</b></span></tpl></div></tpl>', 
                			{
                    			isActive : function(status){
            						return status.value === Ext.data.Types.SprintStatus.CURRENT;
            					},
            					isCompleted : function(status){
            						return status.value === Ext.data.Types.SprintStatus.COMPLETED;
            					}
            				})
						}
					}
				]
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
			viewConfig : {
				plugins : {
            		ptype: 'gridviewdragdrop',
            		dragGroup: 'sprintlogGridDDGroup',
            		dropGroup: 'backlogGridDDGroup',
            		dragText: 'Drag and drop to detach from sprint'
	        	},
				listeners : {
					beforedrop : { fn : this.onBeforeUserStoryDrop  , scope : this},
					drop : { fn : this.onAfterUserStoryDrop, scope : this}
				}
			},
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