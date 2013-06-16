<?php
class CreateCommentAction extends CAction {
	private function checkIsAuthorIdExist(){
		$rest = Yii::app()->request->restParams;

		if (!isset($rest['author_id'])){
			throw new InvalidRestParamsException(500, $this->controller, "author id doesnt exist");
		}
	}
	
	private function checkFormIsValid($form){
		if (!$form->validate()){
			throw new InvalidRestParamsException(500, $this->controller, "request params are invalid");		
		}
	}
	
	public function run(){
		if (Yii::app()->request->isPostRequest){
			$this->onSubmit();
		}
	}
	
	private function onSubmit(){
		$rest = Yii::app()->request->restParams;
		$this->checkIsAuthorIdExist();
		//$this->checkIsProjectIdExist();
		$form = new CommentForm;
		$form->setAttributes(Yii::app()->request->restParams,false);
		$this->checkFormIsValid($form);
		
		if (isset($rest['project_id'])){
			$comment = $this->saveProjectComment($form);
		}
		else if (isset($rest['userstory_id'])){
			$comment = $this->saveUserStoryComment($form);
		}
		else if (isset($rest['sprint_id'])){
			$comment = $this->saveSprintComment($form);
		}
		else if (isset($rest['user_id'])){
			$comment = $this->saveUserComment($form);
		}
		else {
			throw new InvalidRestParamsException(500, $this->controller, 'commentable entity id doesnt exist');
		}

		
		$result = array(
			'success' => true,
			'comment' => array('id' => $comment->id, 
			'post_date' => $comment->post_date)
			);

		echo CJSON::encode($result);
		Yii::app()->end();
	}

	private function saveProjectComment($form){
		$rest = Yii::app()->request->restParams;
		$post_date = new DateTime();

		$comment = new ProjectComment;
		$comment->author_id = $rest['author_id'];
		$comment->project_id = $rest['project_id'];
		$comment->post_date = $post_date->getTimestamp();
		$comment->setAttributes($form->attributes, false);
		$comment->save();

		return $comment;
	}

	private function saveUserComment($form){
		$rest = Yii::app()->request->restParams;
		$post_date = new DateTime();

		$comment = new UserComment;
		$comment->author_id = $rest['author_id'];
		$comment->user_id = $rest['user_id'];
		$comment->project_id = $rest['context_project_id'];
		$comment->post_date = $post_date->getTimestamp();
		$comment->setAttributes($form->attributes, false);
		$comment->save();

		return $comment;
	}

	private function saveUserStoryComment($form){
		$rest = Yii::app()->request->restParams;
		$post_date = new DateTime();

		$comment = new UserStoryComment;
		$comment->author_id = $rest['author_id'];
		$comment->userstory_id = $rest['userstory_id'];
		$comment->post_date = $post_date->getTimestamp();
		$comment->setAttributes($form->attributes, false);
		$comment->save();

		return $comment;
	}

	private function saveSprintComment($form){
		$rest = Yii::app()->request->restParams;
		$post_date = new DateTime();

		$comment = new SprintComment;
		$comment->author_id = $rest['author_id'];
		$comment->sprint_id = $rest['sprint_id'];
		$comment->post_date = $post_date->getTimestamp();
		$comment->setAttributes($form->attributes, false);
		$comment->save();

		return $comment;
	}
}