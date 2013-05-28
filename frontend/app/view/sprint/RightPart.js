/*
 * File: app/view/sprint/RightPart.js
 *
 * This file was generated by Sencha Architect version 2.2.2.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.2.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('Scrum.view.sprint.RightPart', {
    extend: 'Ext.container.Container',
    alias: 'widget.scrum-sprint-right-part',

    requires: [
        'Scrum.view.sprint.form.CreateForm',
        'Scrum.view.sprint.Card',
        'Scrum.view.sprint.summary.SprintSummary',
        'Scrum.view.sprint.summary.BurndownChart'
    ],
    layout: {
        type: 'card'
    },

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'tabpanel',
                    itemId : 'scrum-sprint-tab-panel',
                    activeTab: 0, 
                    tabBar : { cls : 'scrum-tabbar'},
                    items: [
                        {
                            itemId : 'empty-panel',
                            hidden :  true,
                        },
                        Ext.create('Scrum.view.sprint.Card', {
                            title : 'Profile',
                            itemId : 'profile',
                            tabConfig : {
                                itemId : 'profile-tab'
                            }
                        }),
                        Ext.create('Scrum.view.CommentPanel', {
                            title : 'Comments',
                            itemId : 'comments',
                            commentableEntity : {
                                url : '/comments/create',
                                idField : 'sprint_id'
                            }
                        }),
                        Ext.create('Scrum.view.sprint.summary.SprintSummary', {
                            title : 'Summary',
                            itemId : 'summary'
                        }),
                        {
                            title : 'Burndown',
                            itemId : 'burndown',
                            items : [
                                {
                                    xtype : 'panel',
                                    header : {
                                        cls : 'scrum-chart-header'
                                    },
                                    width : '100%',
                                    height : 600,
                                    title : 'Sprint Burndown Chart',
                                    layout : 'fit',
                                    items : [
                                        Ext.create('Scrum.view.sprint.summary.BurndownChart') 
                                    ]
                                }   
                            ]
                        }
                    ]
                },
                Ext.create('Scrum.view.sprint.form.CreateForm', {
                    itemId : 'scrum-sprint-create-form',
                    header : {
                        titleAlign : 'left',
                        tooltipType : 'title',
                        cls : 'scrum-create-form-header',
                        title : 'Create sprint',
                        titlePosition : 0,
                        items : [
                            { type : 'close', title : 'Close', action : 'close'},   
                        ]
                    }
                })
            ]
        });

        me.callParent(arguments);
    }

});