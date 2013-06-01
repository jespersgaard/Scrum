Ext.define('Scrum.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires:[
        'Scrum.view.MainPage',
        'Ext.util.Cookies'
    ],
    layout: 'fit',
    id : 'app_viewport',
    showAuthGroup : function(){
        var me = this;

        loginForm = Ext.create('Scrum.view.form.LoginForm', {
            id : 'login_form',
            url : '/auth/login',
            renderTo : Ext.getBody(),
            floating : true,
        });

        registerForm = Ext.create('Scrum.view.form.RegisterForm', {
            id : 'register_form',
            url : '/auth/registration',
            hidden : true,
            renderTo : Ext.getBody(),
            floating : true,
        });

        loginForm.getDockedComponent('login_footer').getComponent('to_register_button').on({
            click : function(self, e){
                this.hide();
                registerForm.show();
            },
            scope : loginForm
        });
        
        loginForm.on({
            actioncomplete : function(self, e){
                Ext.destroy(loginForm);
                Ext.destroy(registerForm);
                me.showMainPage();
            }
        });
        
        loginForm.mon(registerForm, 'actioncomplete', function(){
            var authStatus = this.getComponent('auth_status');

            registerForm.hide();
            this.show();
            authStatus.update('<h3>Now you can sign in</h3>');
            authStatus.removeCls();
            authStatus.addCls('app-statusbar-success');
            authStatus.show();
            
        }, loginForm);
        Ext.create('Ext.util.KeyNav', {
            target : "login_form",
            enter : function(){
                form = this.getForm();
                if (form.isValid)
                    this.getDockedComponent('login_footer').
                    getComponent('login_button').fireEvent('click');
            },
            scope : loginForm
        });
    
        registerForm.getDockedComponent('register_buttons').getComponent('back_to_login_button').on({
            click : function(self, e){
                this.hide();
                loginForm.show();
            },
            scope : registerForm
        });

        Ext.create('Ext.util.KeyNav', {
            target : 'register_form',
            enter : function(){
                form = this.getForm();
                if (form.isValid)
                    this.getDockedComponent('register_buttons').
                    getComponent('submit_registration_form_button').fireEvent('click');
            },
            scope : registerForm
        });
    },
    showMainPage : function(){
        Ext.state.Manager.setProvider(Ext.create('Scrum.state.UserStateProvider'));
        this.add(Ext.create('Scrum.view.MainPage'));
    },
    listeners : {
        afterrender : function(){
            var loginForm,registerForm,tabpanel;

            if (Ext.util.Cookies.get('login')){
                this.showMainPage();
            }
            else {
                this.showAuthGroup();
            }
        }
    }
});