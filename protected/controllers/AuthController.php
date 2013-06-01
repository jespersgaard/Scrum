<?php
 
class AuthController extends Controller {
	public function actions(){
		return array(
			'index' => 'application.controllers.auth.LoginAction',
			'login' => 'application.controllers.auth.LoginAction', 
			'registration' => 'application.controllers.auth.RegistrationAction'
		);
	}

	public function actionLogout(){
		Yii::app()->user->logout();
		$cookies = Yii::app()->request->getCookies();
		$cookies->remove('login');
		$cookies->remove('state-cookie');
	}	
}