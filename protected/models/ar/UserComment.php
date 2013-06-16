<?php
class UserComment extends CActiveRecord {
	public $content;
	public $post_date;

	public static function model($className=__CLASS__){
		return parent::model($className);
	}
	
	public function tableName(){
		return 'user_comments_table';
	}
	
	public function primaryKey(){
		return 'id';
	}
	
	public function relations(){
		return array(
			'user' => array(self::BELONGS_TO, 'UserRecord', 'user_id'),
			'author' => array(self::BELONGS_TO, 'UserRecord', 'author_id')
		);
	}
	
	public function scopes(){
		return array(
			'byUser',
			'since'
		);
	}

	public function byUser($projectId,$userId){
		$this->getDbCriteria()->mergeWith(array(
			'condition' => 'user_id=:user_id AND project_id=:project_id',
			'params' => array(':user_id' => $userId, ':project_id' => $projectId)
		));
		return $this;
	}

	public function since($lastDays = 7){
		$this->getDbCriteria()->mergeWith(array(
			'condition' => 'TIMESTAMP_DIFF(DAY,post_date,NOW()) <= :lastdays',
			'params' => array(':lastdays' => $lastDays)
		));

		return $this;
	}
}