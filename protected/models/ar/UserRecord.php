<?php
class UserRecord extends CActiveRecord {
	public $firstname;
	public $lastname;
	public $email;
	public $password;
	public $company;
	//session_information
	public $session_count;
	public $session_key;
	public $login_time;
	//user settings;
	public $date_format = 'dd/mm/yy';
	public $time_format = 'hh:mm:ss';
	public $first_day_of_week = 'monday';
	public $number_format = '0.00';
	public $email_notification_settings = '';
	
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
	
	public function tableName()
	{
		return 'user_table';
	}
	
	public function primaryKey(){
		return 'id';
	}
	
	public function relations(){
		return array('projects' => array(self::MANY_MANY, 'Project', 'user_projects_table(user_id, project_id)'),
					 'company' => array(self::BELONGS_TO, 'Company', 'company_id'),
					 'active_project' => array(self::BELONGS_TO, 'Project', 'active_project_id'));
	}
	
	public function byProject($projectId){
		$this->getDbCriteria()->mergeWith(array(
				'condition' => '`'.$this->getTableAlias().'`.`project_id`=:project_id AND `'.$this->getTableAlias().'`.`dropped`=0', 
				'params' => array(':project_id' => $projectId)
		));

		return $this;
	}
}