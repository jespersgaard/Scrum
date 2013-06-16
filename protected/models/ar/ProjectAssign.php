<?php

class ProjectAssign extends CActiveRecord {
	
	public static function model($className=__CLASS__){
		return parent::model($className);
	}
	
	public function tableName(){
		return 'user_projects_table';
	}
	
	public function primaryKey(){
		return 'id';
	}
	
	public function relations(){
		return array(
			'user' => array(self::BELONGS_TO, 'UserRecord', 'user_id'),
			'project' => array(self::BELONGS_TO, 'Project', 'project_id')
		);
	}
}