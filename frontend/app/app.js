/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides

//including my own field data types in Ext.data.Types
//get from http://docs.sencha.com/extjs/4.2.0/#!/api/Ext.data.Types
Ext.Loader.require('Ext.data.Types', function(){
    Ext.Loader.require('Scrum.types.Enumerable');
    Ext.Loader.require('Scrum.types.UserStoryStatus');
    Ext.Loader.require('Scrum.types.SprintStatus');
    Ext.Loader.require('Scrum.types.UserStoryPriority');
    // ... other custom Ext.data.Types bootstrap refs 
});

Ext.application({
    name: 'Scrum',
    appFolder : '/frontend/app',
    require : [
        'Scrum.state.UserStateProvider'
    ],
    controllers : [
        'TopPanel',
        'ProjectProfile',
        'userstory.Backlog',
        'userstory.UserStoryProfile',
        'sprint.SprintManager',
        'sprint.SprintProfile',
        'team.TeamManager',
        'team.UserProfile'
    ],
    views: [
        'Viewport',
    ],
    autoCreateViewport: true
});
//ExtJS 4.2 Tooltip width fix;
Ext.override(Ext.tip.QuickTip, {
        helperElId: 'ext-quicktips-tip-helper',
        initComponent: function ()
        {
            var me = this;


            me.target = me.target || Ext.getDoc();
            me.targets = me.targets || {};
            me.callParent();


            // new stuff
            me.on('move', function ()
            {
                var offset = me.hasCls('x-tip-form-invalid') ? 35 : 12,
                    helperEl = Ext.fly(me.helperElId) || Ext.fly(
                        Ext.DomHelper.createDom({
                            tag: 'div',
                            id: me.helperElId,
                            style: {
                                position: 'absolute',
                                left: '-1000px',
                                top: '-1000px',
                                'font-size': '12px',
                                'font-family': 'tahoma, arial, verdana, sans-serif'
                            }
                        }, Ext.getBody())
                    );

                if (me.html && (me.html !== helperEl.getHTML() || me.getWidth() !== (helperEl.dom.clientWidth + offset)))
                {
                    helperEl.update(me.html);
                    me.setWidth(Ext.Number.constrain(helperEl.dom.clientWidth + offset, me.minWidth, me.maxWidth));
                }
            }, this);
        }
    });

Ext.namespace('Scrum.util', 'Scrum.util.template', 'Scrum.util.template.date');
Ext.namespace('Scrum.util', 'Scrum.util.debug');
Scrum.util.template.date.MS_IN_WEEK = 3600*1000*24*7;
Scrum.util.template.PRIORITY_DISPLAY_VALUES = { 0 : 'Low', 1 : 'Medium', 2 : 'High'};

Scrum.util.template.getPostDate = function(date){
    var hours, days, months;
    var now = Date.now();
    var value = date.getTime();
    var string;
    var diff = now - value;

    if (diff >= Scrum.util.template.date.MS_IN_WEEK){
        string = Ext.Date.format(date, 'F j, Y, g:i a');
    }
    else if (diff <= 3600*1000){
        string = 'less an hour ago';
    }
    else {
        hours = Math.floor(diff / (3600*1000));
        if (hours <= 24){
            string = hours + ' hour ago';
        }
        else {
            days = Math.floor(hours / 24);
            if (days <= 7){
                string = days + ' days ago';
            }
        }}

    return string;  
}

Scrum.util.debug.GenerateFiveMonthDays = function(){
    var days = 30, dayOfMonth;
    var hits = [];
    var i;
    var max,min;
    
    for (i = 0, max = days, min = 0;i < 5;i++){
        dayOfMonth = Math.ceil(Math.random() * (max - min) + min);
        hits.push(Math.ceil(new Date('02/' + dayOfMonth + '/2013') / 1000));
        min = dayOfMonth + 1;
    }

    return hits;
}