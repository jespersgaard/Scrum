<?php

class UserController extends Controller
{
	public function actions()
	{
		return array(
				// page action renders "static" pages stored under 'protected/views/site/pages'
				// They can be accessed via: index.php?r=site/page&view=FileName
				'page'=>array(
						'class'=>'CViewAction',
				),
		);
	}

	public function representations($representation){
		$arr = array('table' => 'BootstrapTableView', 'grid' => 'BootstrapGridView');
		return (!empty($representation) && isset($arr[$representation]))? $arr[$representation]: $arr; 
	}
	
	public function actionIndex(){
		// renders the view file 'protected/views/site/index.php'
		// using the default layout 'protected/views/layouts/main.php'
		$this->render('me');
	}

	public function actionMe(){
		$this->render('me', array('activeTab' => 'you'));
	}
	
	//������ user/team
	//������ user/team/?view=table
	//������ user/team/?view=grid
	public function actionTeam(){
		$activeRepresentation = (isset($this->actionParams) && !empty($this->actionParams['view']))? $this->actionParams['view'] : 'table';
		$this->render('team', array('activeTab' => 'team', 'activeRepresentation' => $activeRepresentation));
	}
	
	public function actionError()
	{
		if($error=Yii::app()->errorHandler->error)
		{
			if(Yii::app()->request->isAjaxRequest)
				echo $error['message'];
			else
				$this->render('error', $error);
		}
	}
}