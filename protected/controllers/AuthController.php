<?php
 
class AuthController extends Controller {
	public function actions(){
		return array(
				'index' => 'application.controllers.auth.LoginAction',
				'login' => 'application.controllers.auth.LoginAction', 
				'register' => 'application.controllers.auth.RegisterAction'
		);
	}	
}