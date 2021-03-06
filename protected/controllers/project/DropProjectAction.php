<?php
class DropProjectAction extends CAction {
	public function run(){
		if (Yii::app()->request->isPostRequest){
			$this->onSubmit();
		}
	}
	
	private function onSubmit(){
		$request = Yii::app()->request;
		if (isset($request->restParams['ids'])){
			$ids = Yii::app()->request->restParams['ids'];

			Project::model()->updateByPk($ids, array('dropped' => true));
			$projects = Project::model()->findAllByAttributes(array('id' => $ids));
			
			echo CJSON::encode(array('success' => true, 'data' => $projects));
			Yii::app()->end();	
		}
		else if (isset($request->restParams['id'])){
			$id = Yii::app()->request->restParams['id'];
			
			$project = Project::model()->findByPk($id);
			$project->dropped = true;
			$project->save();

			echo CJSON::encode(array('success' => true, 'data' => array($project)));
			Yii::app()->end();
		}
		else {
			throw new InvalidRestParamsException(500, $this->controller, 'Request parameters doesnt exist');
		}
	}
} 