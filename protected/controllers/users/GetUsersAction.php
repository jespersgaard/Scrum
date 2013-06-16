<?php 
class GetUsersAction extends CAction {
	public function run(){
		if (Yii::app()->request->isAjaxRequest){
			$this->onAjax();
		}
	}

	public function onAjax(){
		$request = Yii::app()->request;

		if (isset($_GET['project_id'])){
			$projectId = $_GET['project_id'];
			$users = ProjectAssign::model()->
				with(array('user' => array('select' => 'id,firstname,lastname,description,login_time')))
				->findAll('project_id=:project_id', array(':project_id' => $projectId));

			$jsonResult = array();
			foreach($users as $id => $record){
				$jsonResult[$id] = $record->user->getAttributes(array('id','firstname', 'lastname', 'description','login_time'));
			}
		}
		else if (isset($_GET['id'])){
			$user = UserRecord::model()->setDbCriteria(array('select' => 'id,firstname,lastname, description,login_time'))
				->findByPk($_GET['id']);
			$jsonResult = $user->getAttributes();
			$single = true;
		}

		$payload = array('success' => true);
		if (isset($single) && !empty($single)){
			$payload['user'] = $jsonResult;
			
			echo CJSON::encode($payload);
		}
		else {
			$payload['users'] = $jsonResult;
			if (isset($page) && !empty($page))
				$payload['total'] = $total;

			echo CJSON::encode($payload);
		}
	}
}