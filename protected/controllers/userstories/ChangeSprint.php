<?php 
class ChangeSprint extends CAction {
	public function run(){
		if (Yii::app()->request->isAjaxRequest){
			$this->onAjax();
		}
	}

	private function checkIsIdExist(){
		if (!isset($_GET['id'])){
			throw new InvalidRestParamsException(500, $this->controller, "userstory id doesnt exist");
		}
	}

	/*private function checkIsValidStatus(){
		$requestPayload = CJSON::decode(array_keys(Yii::app()->request->restParams)[0]);
		$valid = true;
		
		if (!isset($requestPayload['status']))
			$valid = false;

		$statusValue = $requestPayload['status']['value'];

		if (!empty($valid) || !isset($statusValue) || !($statusValue === UserStoryStatusCodes::ACCEPTED)){
			throw new InvalidRestParamsException(500, $this->controller, "userstory have invalid status");

			Yii::app()->end();
		}
	}*/

	private function onAjax(){
		$this->checkIsIdExist();
		if (isset($_GET['detach'])){
			$this->detachFromSprint();
		}
		else if (isset($_GET['sprint_id'])){
			$this->attachToSprint();
		}
	}

	private function detachFromSprint(){
		$update_time = new DateTime();

		$id = $_GET['id'];
		$userstory = UserStory::model()->findByPk($id);
		$userstory->status = $status = UserStoryStatusCodes::OPEN;
		$sprint = $userstory->getRelated('sprint');
		$sprint->estimate -= $userstory->estimate;
		$sprint->save();
		$userstory->sprint_id = null;
		$userstory->update_time = $update_time->getTimestamp();
		$userstory->save();
	
		echo CJSON::encode(array('success' => true, 
			'userstory' => array(
				'id' => $userstory->id,
				'status' => $status, 
				'sprint' => null,
				'update_time' => $update_time->getTimestamp()
			)));
	}

	private function attachToSprint(){
		$update_time = new DateTime();

		$id = $_GET['id'];
		//$this->checkIsValidStatus();
		$userstory = UserStory::model()->findByPk($id);
		$userstory->status = $status = UserStoryStatusCodes::TODO;
		$userstory->sprint_id = $_GET['sprint_id'];
		$userstory->update_time = $update_time->getTimestamp();
		$userstory->save();
		$sprint = $userstory->getRelated('sprint');
		$sprint->estimate += $userstory->estimate; 
		$sprint->save();

		echo CJSON::encode(array('success' => true, 'userstory' => array(
			'id' => $userstory->id, 
			'sprint' => $sprint->getAttributes(array('id', 'name', 'estimate')), 
			'status' => $status, 
			'update_time' => $update_time->getTimestamp()
			)));
	}
}
