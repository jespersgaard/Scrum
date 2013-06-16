Ext.define('Scrum.view.userstory.form.PriorityCombobox', {
	extend : 'Ext.form.field.ComboBox',
	xtype : 'scrum-userstory-priority-combobox',
	allowBlank : false,
	displayField : 'display',
	valueField : 'value',
	store : Ext.create('Ext.data.Store', {
		fields : ['value', 'display'],
		/*data : [
			{ value : 0, display : 'Low'},
			{ value : 1, display : 'Medium'},
			{ value : 2, display : 'High'}
		]*/
		data : Ext.data.Types.UserStoryPriority.getHashes() 
	})
})