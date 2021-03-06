<?php
class GetProjectAction extends CAction {
	public function run(){
		if (Yii::app()->request->isAjaxRequest){
			$this->onAjax();
		}
		else {
			$this->onGet();
		}
	}
	
	public function onAjax(){
		$request = Yii::app()->request;
		
		if (isset($_GET['live'])){
			$jsonResult = $this->fetchCollection('live');
		}
		else if (isset($_GET['trashed'])){
			$jsonResult = $this->fetchCollection('trashed');
		}
		else if (isset($_GET['favorite'])){
			$jsonResult = $this->fetchCollection('favorite');
		}
		else if (isset($_GET['id'])){
			$jsonResult = $this->fetchSingle();
		}
		else {
			$jsonResult = $this->fetchActive();
		}

		$jsonResult = array_merge(array('success' => true), $jsonResult);
		echo CJSON::encode($jsonResult);
	}
	
	public function onGet(){
		$request = Yii::app()->request;
		$userId = Yii::app()->user->getState('user-id');
		if (isset($_GET['all'])){
			$this->controller->render('table');
		}
		else {
			$this->controller->render('dashboard');
		}
	}

	private function fetchCollection($collectionName){
		$userId = Yii::app()->user->getState('user-id');
		$jsonResult = array();
		$model = Project::model();
		$scope = call_user_func(array($model, $collectionName), $userId);

		if (isset($_GET['data']) && !empty($_GET['data'])){
			$result = $scope->findAll();
			$jsonResult['data'] = array();
			foreach($result as $id => $record){
				$jsonResult['data'][$id] = $record->getAttributes();
			}
		}

		if (isset($_GET['count'])){
			if (isset($_GET['data']) && isset($result))	
				$jsonResult['count'] = count($result);
			else{
				$jsonResult['count'] = $scope->count();

			}
		}

		return $jsonResult;
	}

	/*fetch one model by id*/
	private function fetchSingle(){
		$result = Project::model()->findByPk($_GET['id']);
		return array($result);
	}

	private function fetchActive(){
		$result = Project::model()->findByPk(Yii::app()->user->getState("project-id"));
		return array($result);
	}
}