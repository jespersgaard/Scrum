<?php

class UsersController extends Controller
{
	public function actions(){
		return array(
			'index' => 'application.controllers.users.GetUsersAction',
			'get' => 'application.controllers.users.GetUsersAction'
		);
	}
}