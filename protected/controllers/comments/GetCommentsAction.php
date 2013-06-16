<?php 
class GetCommentsAction extends CAction {
	public function run(){
		$this->onAjax();
	}

	public function onAjax(){
		if (isset($_GET['project_id'])){
			$result = $this->fetchProjectComments();
		}
		else if (isset($_GET['userstory_id'])){
			$result = $this->fetchUserStoryComments();
		}
		else if (isset($_GET['sprint_id'])){
			$result = $this->fetchSprintComments();
		}
		else if (isset($_GET['user_id'])){
			$result = $this->fetchUserComments();
		}

		echo CJSON::encode(array('success' => true, 'total' => count($result), 'comments' => $result));
	}

	private function fetchProjectComments(){
		$jsonResult = array();

		$comments = ProjectComment::model()->byProject($_GET['project_id'])->with('author')->findAll();
		foreach($comments as $id => $record){
			$jsonResult[$id] = $record->getAttributes();
			$author = $record->getRelated('author');
			$jsonResult[$id]['author'] = $author->firstname.' '.$author->lastname;
		}

		return $jsonResult;
	}

	private function fetchUserComments(){
		$jsonResult = array();

		$comments = UserComment::model()->byUser($_GET['context_project_id'], $_GET['user_id'])->with('author')->findAll();
		foreach($comments as $id => $record){
			$jsonResult[$id] = $record->getAttributes();
			$author = $record->getRelated('author');
			$jsonResult[$id]['author'] = $author->firstname.' '.$author->lastname;
		}

		return $jsonResult;
	}

	private function fetchUserStoryComments(){
		$jsonResult = array();

		$comments = UserStoryComment::model()->byUserstory($_GET['userstory_id'])->with('author')->findAll();
		foreach($comments as $id => $record){
			$jsonResult[$id] = $record->getAttributes();
			$author = $record->getRelated('author');
			$jsonResult[$id]['author'] = $author->firstname.' '.$author->lastname;
		}

		return $jsonResult;
	}

	private function fetchSprintComments(){
		$jsonResult = array();

		$comments = SprintComment::model()->bySprint($_GET['sprint_id'])->with('author')->findAll();
		foreach($comments as $id => $record){
			$jsonResult[$id] = $record->getAttributes();
			$author = $record->getRelated('author');
			$jsonResult[$id]['author'] = $author->firstname.' '.$author->lastname;
		}

		return $jsonResult;
	}
}