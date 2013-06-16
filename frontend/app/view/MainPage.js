Ext.define('Scrum.view.MainPage', {
    xtype : 'scrum-mainpage',
	extend : 'Ext.panel.Panel',
	require : [
        'Scrum.view.ContentPanel',
		'Scrum.view.TopPanel'
	],
	layout: {
        type: 'vbox',
        align : 'stretch',
        pack  : 'start',
    },
    items : [
    	Ext.create('Scrum.view.TopPanel', { border : false}),
    	Ext.create('Scrum.view.ContentPanel', { flex : 1, border : false})
       // {html:'', cls : 'scrum-footer', height:35, border : false}
    ]
});