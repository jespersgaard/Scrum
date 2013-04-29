<?php
class FinishUserStoryAction extends CAction {
	public function run(){
		if (Yii::app()->request->isPostRequest){
			$this->onSubmit();
		}
	}

	private function onSubmit(){
		$request = Yii::app()->request;

		if (isset($request->restParams['ids'])){
			$ids = $request->restParams['ids'];
		
			UserStory::model()->updateByPk($ids, array(
				'status' => UserStoryStatusCodes::DONE));

			$userstories = UserStory::model()->findAllByPK($ids);
	
			echo CJSON::encode(array('success' => true, 'data' => $userstories));
			Yii::app()->end();	
		}
		else if (isset($request->restParams['id'])){
			$id = Yii::app()->request->restParams['id'];

			$userstory = UserStory::model()->findByPk($id);
			$userstory->status = UserStoryStatusCodes::DONE;
			$userstory->save();
			
			echo CJSON::encode(array('success' => true, 'data' => array($userstory)));
			Yii::app()->end();
		}
		else {
			throw new InvalidRestParamsException(500, $this->controller, 'Request parameters doesnt exist');
		}
	}
}