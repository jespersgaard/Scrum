Ext.define('Scrum.view.userstory.form.EditForm', {
	extend : 'Ext.form.Panel',
	xtype : 'scrum-userstory-edit-form',
	layout : { type : 'anchor'},
	padding : 10,
	url : '/userstories/update',
	require : [
		'Scrum.view.userstory.form.PriorityCombobox',
		'Ext.ux.statusbar.StatusBar'
	],
	tbar : Ext.create('Ext.ux.statusbar.StatusBar', {
		hidden : true,
		cls : 'scrum-form-top-status-bar'
	}),
	onInvalidFields : function(){
		var statusBar = this.down('statusbar');

		statusBar.addCls('error').show();
		statusBar.setStatus( { iconCls : 'x-status-error', text : '<span class="status-string">Fill required fields or correct invalids</span>'});
		statusBar.show();
	},
	initComponent : function(){
		Ext.apply(this, {
			items : [
				{ xtype : 'hiddenfield', name : 'id'},
				{ 
					xtype : 'textfield',
					name : 'name',
					width : 200,
					allowBlank : false,
					fieldLabel : 'Name', 
					labelAlign : 'top'
				},
				{
					xtype : 'container',
					layout : { type : 'hbox', defaultMargins : '0 10 0 0'},
					items : [
						{
							xtype : 'numberfield',
							name: 'estimate',
							labelAlign : 'top',
							fieldLabel: 'Estimate',
							allowBlank : false,
							maxValue: 99,
							minValue: 0
						},
						Ext.create('Scrum.view.userstory.form.PriorityCombobox', {
							fieldLabel : 'Priority',
							labelAlign : 'top',
							name : 'priority'
						})
					]
				},
				{ 
					xtype : 'htmleditor',
					fieldLabel : 'Description',
				 	height : 450,
				 	width : 550,
				 	labelAlign : 'top',
				 	name : 'description'
			 	}
			]
		});

		this.callParent();
	},
	bbar : {
		cls : 'scrum-form-bottom-bar'
	},
	buttonAlign : 'left',
	buttons : [
		{ text : 'Save', action : 'submit'}
	]
});